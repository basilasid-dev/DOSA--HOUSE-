import Phaser from 'phaser';
import { THEME } from '../config/theme';
import { SoundFX } from '../audio/SoundFX';
import { DosaFoldType, Recipe } from '../types/recipe';
import { UpgradeService } from '../services/UpgradeService';

export type DosaState =
  | 'EMPTY'         // Clean tawa, waiting for batter ladle
  | 'POURED'        // Wet batter dollop on tawa, ready to spread
  | 'SPREADING'     // Player swirling ladle/finger to expand batter
  | 'COOKING'       // Batter spread, roasting on hot cast-iron
  | 'PERFECT_ROAST' // Ideal golden crispy roast achieved
  | 'BURNT'         // Left too long on heat
  | 'FOLDED'        // Folded into cylinder, triangle, half-moon, or open-face
  | 'PLATED';       // Plated on banana leaf platter

export interface DosaCookerOptions {
  scene: Phaser.Scene;
  x: number;
  y: number;
  radius?: number;
  getTemperature: () => number;
  onStateChange?: (state: DosaState, progress: number) => void;
  onSpreadComplete?: () => void;
}

export interface DosaCookingQuality {
  overallScore: number;       // 0 to 100%
  stars: number;              // 1 to 3
  crispinessScore: number;    // 0 to 100%
  gheeScore: number;          // 0 to 100%
  toppingsScore: number;      // 0 to 100%
  foldScore: number;          // 0 to 100%
  earnedCoins: number;        // e.g. 50 - 150
  gradeTitle: string;         // e.g. "Royal Masterpiece!", "Delicious Tiffin"
  feedbackNotes: string[];
}

interface BubbleHole {
  normR: number;     // 0.1 to 0.9 (normalized radius)
  angle: number;     // 0 to 2*PI
  size: number;      // 1.5 to 3.8
  opacity: number;
}

export class DosaSurface {
  private scene: Phaser.Scene;
  private x: number;
  private y: number;
  private maxRadius: number;
  private state: DosaState = 'EMPTY';

  // Batter geometry & spreading
  private currentSpreadRadius: number = 0;
  private initialDollopRadius: number = 44;
  private totalRotation: number = 0;
  private lastPointerAngle: number = 0;
  private spreadProgress: number = 0;
  private spiralHistory: { r: number; angle: number }[] = [];
  private lastSwirlSoundTime: number = 0;
  private smoothnessPoints: number = 0;

  // Cooking & Browning
  private cookingProgress: number = 0; // 0.0 -> 1.0 (perfect) -> 1.3 (overdone)
  private getTemperature: () => number;
  private onStateChange?: (state: DosaState, progress: number) => void;
  private onSpreadComplete?: () => void;

  // Stage 2: Ghee, Toppings, Flipping, Folding & Plating
  private hasGhee: boolean = false;
  private gheeCount: number = 0;
  private appliedToppings: Set<string> = new Set<string>();
  private isFlipped: boolean = false;
  private flipCount: number = 0;
  private isFolded: boolean = false;
  private foldType: DosaFoldType | null = null;
  private isPlated: boolean = false;
  private onPlatedClick?: () => void;

  // Visual Display Objects
  private container: Phaser.GameObjects.Container;
  private dosaGraphics: Phaser.GameObjects.Graphics;
  private dollopSprite?: Phaser.GameObjects.Image;
  private guideGraphics: Phaser.GameObjects.Graphics;

  // Pre-calculated organic micro-pores (so they stay stationary as the dosa roasts)
  private bubbles: BubbleHole[] = [];

  // Organic edge jitter offsets (36 segments around circumference)
  private edgeJitter: number[] = [];

  constructor(options: DosaCookerOptions) {
    this.scene = options.scene;
    this.x = options.x;
    this.y = options.y;
    this.maxRadius = options.radius ?? 142;
    this.getTemperature = options.getTemperature;
    this.onStateChange = options.onStateChange;
    this.onSpreadComplete = options.onSpreadComplete;

    this.container = this.scene.add.container(this.x, this.y);
    this.container.setDepth(15);

    // Dosa procedural rendering graphics
    this.dosaGraphics = this.scene.add.graphics();
    this.container.add(this.dosaGraphics);

    // Swirl guidance graphics (animated ring/spiral for beginners)
    this.guideGraphics = this.scene.add.graphics();
    this.container.add(this.guideGraphics);

    // Generate fixed fermentation bubble layout
    this.initPorousBubbles();

    // Generate fixed edge jitter for handmade organic dosa boundary
    for (let i = 0; i < 36; i++) {
      this.edgeJitter.push((Math.sin(i * 1.8) * 2.2) + (Math.cos(i * 3.4) * 1.6));
    }

    // Set initial empty display
    this.draw();
  }

  /**
   * Pre-generate organic micro-pores
   */
  private initPorousBubbles(): void {
    this.bubbles = [];
    const count = 46;
    for (let i = 0; i < count; i++) {
      const normR = 0.14 + (Math.sqrt((i + 1) / count) * 0.78);
      const angle = (i * 2.399963) % (Math.PI * 2); // Golden ratio spiral distribution
      const size = 1.6 + ((i % 5) * 0.45);
      const opacity = 0.5 + ((i % 4) * 0.12);
      this.bubbles.push({ normR, angle, size, opacity });
    }
  }

  /**
   * Pour a ladle of wet batter onto the tawa
   */
  public pourBatter(pourX: number = this.x, pourY: number = this.y): boolean {
    if (this.state !== 'EMPTY') return false;

    this.state = 'POURED';
    this.currentSpreadRadius = this.initialDollopRadius;
    this.totalRotation = 0;
    this.spreadProgress = 0;
    this.cookingProgress = 0;
    this.spiralHistory = [];
    this.hasGhee = false;
    this.gheeCount = 0;
    this.appliedToppings.clear();
    this.isFlipped = false;
    this.flipCount = 0;
    this.isFolded = false;
    this.foldType = null;
    this.isPlated = false;

    this.container.setPosition(this.x, this.y);
    this.container.setScale(1.0);

    // Batter pour audio & sizzle burst
    SoundFX.getInstance().playBatterPour();

    // Spawn wet batter dollop image with juicy squish bounce
    if (!this.dollopSprite) {
      this.dollopSprite = this.scene.add.image(0, 0, 'fx_batter_dollop');
      this.container.add(this.dollopSprite);
    }
    this.dollopSprite.setVisible(true);
    this.dollopSprite.setScale(0.2);
    this.dollopSprite.setAlpha(0.95);

    this.scene.tweens.add({
      targets: this.dollopSprite,
      scaleX: 1.0,
      scaleY: 1.0,
      duration: 220,
      ease: 'Back.easeOut',
      easeParams: [1.8]
    });

    // Flash sizzle ripple
    const ripple = this.scene.add.circle(this.x, this.y, 40, THEME.colors.cream, 0.5);
    this.scene.tweens.add({
      targets: ripple,
      scaleX: 2.2,
      scaleY: 2.2,
      alpha: 0,
      duration: 350,
      onComplete: () => ripple.destroy()
    });

    this.draw();
    this.onStateChange?.(this.state, 0);
    return true;
  }

  /**
   * Start swirling gesture with mouse pointer or touch
   */
  public startSpread(pointerX: number, pointerY: number): boolean {
    if (this.state !== 'POURED' && this.state !== 'SPREADING') return false;

    const dx = pointerX - this.x;
    const dy = pointerY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Can start anywhere on the hot tawa griddle
    if (dist > this.maxRadius + 30) {
      return false;
    }

    this.state = 'SPREADING';
    this.lastPointerAngle = Math.atan2(dy, dx);
    this.smoothnessPoints = 0;

    if (this.dollopSprite) {
      this.dollopSprite.setVisible(false);
    }

    this.draw();
    this.onStateChange?.(this.state, this.spreadProgress);
    return true;
  }

  /**
   * Update circular spreading as pointer moves in expanding circles
   */
  public updateSpread(pointerX: number, pointerY: number): void {
    if (this.state !== 'SPREADING') return;

    const dx = pointerX - this.x;
    const dy = pointerY - this.y;
    const angle = Math.atan2(dy, dx);

    // Angular rotation tracking (handles both clockwise and anti-clockwise)
    let deltaAngle = angle - this.lastPointerAngle;
    while (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
    while (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;

    const absDelta = Math.abs(deltaAngle);

    // Filter out erratic teleport jumps
    if (absDelta < Math.PI * 0.75 && absDelta > 0.015) {
      const spreadMult = UpgradeService.getInstance().getSpreadSpeedMultiplier();
      this.totalRotation += absDelta * spreadMult;

      // Pure rotational spiral expansion:
      // ~2.5 * PI radians (~1.25 full circles) smoothly expands from wet dollop (44px) to full crisp dosa (142px)
      const targetRadius = Phaser.Math.Clamp(
        this.initialDollopRadius + (this.totalRotation / (2.5 * Math.PI)) * (this.maxRadius - this.initialDollopRadius),
        this.initialDollopRadius,
        this.maxRadius
      );

      // Expand outward smoothly and naturally with lerp
      this.currentSpreadRadius = Phaser.Math.Linear(this.currentSpreadRadius, targetRadius, 0.3);
      this.smoothnessPoints++;

      // Record swirl spiral path to render authentic ladle ridges
      this.spiralHistory.push({ r: this.currentSpreadRadius, angle });
      if (this.spiralHistory.length > 80) {
        this.spiralHistory.shift();
      }

      // Rhythmic swoosh sound as ladle glides on iron
      const now = Date.now();
      if (now - this.lastSwirlSoundTime > 130) {
        SoundFX.getInstance().playSwirlGlide();
        this.lastSwirlSoundTime = now;
      }

      this.lastPointerAngle = angle;
    }

    // Spread progress 0.0 -> 1.0
    this.spreadProgress = Phaser.Math.Clamp(
      (this.currentSpreadRadius - this.initialDollopRadius) / (this.maxRadius - this.initialDollopRadius),
      0,
      1
    );

    this.draw();
    this.onStateChange?.(this.state, this.spreadProgress);

    // Check completion condition
    if (this.currentSpreadRadius >= this.maxRadius * 0.94 && this.totalRotation >= 2.4 * Math.PI) {
      this.completeSpread();
    }
  }

  /**
   * Finalize circular spreading into fully spread dosa
   */
  public completeSpread(): void {
    if (this.state === 'COOKING' || this.state === 'PERFECT_ROAST' || this.state === 'BURNT' || this.state === 'FOLDED' || this.state === 'PLATED') return;

    this.state = 'COOKING';
    this.currentSpreadRadius = this.maxRadius;
    this.spreadProgress = 1.0;
    this.cookingProgress = 0.05;

    // Harmonious major triad success sound
    SoundFX.getInstance().playSuccessChime();
    SoundFX.getInstance().playSizzle(1.8);

    // Visual fanfare: Golden celebratory particle ring
    const flashRing = this.scene.add.graphics();
    flashRing.lineStyle(4, THEME.colors.turmericBright, 0.9);
    flashRing.strokeCircle(this.x, this.y, this.maxRadius);
    this.scene.tweens.add({
      targets: flashRing,
      scaleX: 1.15,
      scaleY: 1.15,
      alpha: 0,
      duration: 400,
      onComplete: () => flashRing.destroy()
    });

    this.spawnFloatingBadge('★ CRISPY SPREAD! ★', THEME.colors.turmericBrightHex);

    this.draw();
    this.onStateChange?.(this.state, this.cookingProgress);
    this.onSpreadComplete?.();
  }

  /**
   * End or interrupt spread pointer gesture
   */
  public endSpread(): void {
    if (this.state === 'SPREADING') {
      if (this.spreadProgress >= 0.88) {
        this.completeSpread();
      } else {
        this.draw();
      }
    }
  }

  /**
   * 1. Add Desi Cow Ghee to roasting dosa
   */
  public addGhee(): boolean {
    if (this.state !== 'COOKING' && this.state !== 'PERFECT_ROAST') {
      return false;
    }
    this.hasGhee = true;
    this.gheeCount++;

    SoundFX.getInstance().playGheeDrizzle();

    // Sizzling golden ripple
    const ripple = this.scene.add.graphics();
    ripple.lineStyle(3, THEME.colors.turmericBright, 0.85);
    ripple.strokeCircle(this.x, this.y, this.currentSpreadRadius * 0.85);
    this.scene.tweens.add({
      targets: ripple,
      scaleX: 1.12,
      scaleY: 1.12,
      alpha: 0,
      duration: 380,
      onComplete: () => ripple.destroy()
    });

    this.spawnFloatingBadge('🧈 +PURE DESI GHEE', THEME.colors.turmericBrightHex);
    this.draw();
    this.onStateChange?.(this.state, this.cookingProgress);
    return true;
  }

  /**
   * 2. Add Selectable Topping or Filling
   */
  public addTopping(toppingId: string): boolean {
    if (this.state !== 'COOKING' && this.state !== 'PERFECT_ROAST') {
      return false;
    }

    this.appliedToppings.add(toppingId);
    SoundFX.getInstance().playToppingAdd();

    let label = 'TOPPING';
    let color: string = THEME.colors.creamHex;
    if (toppingId === 'potato_masala') {
      label = '🥔 +SPICED POTATO MASALA';
      color = THEME.colors.turmericBrightHex;
    } else if (toppingId === 'idli_podi') {
      label = '🌶️ +GUNPOWDER IDLI PODI';
      color = THEME.colors.terracottaBrightHex;
    } else if (toppingId === 'shallots') {
      label = '🧅 +SHALLOTS & CHILLIES';
      color = THEME.colors.creamHex;
    } else if (toppingId === 'mysore_paste') {
      label = '🧄 +MYSORE RED CHUTNEY';
      color = '#E74C3C';
    } else if (toppingId === 'paneer_masala') {
      label = '🧀 +CHETTINAD PANEER';
      color = '#F39C12';
    } else if (toppingId === 'amul_cheese') {
      label = '🧀 +GRATED AMUL CHEESE';
      color = '#F9E79F';
    } else if (toppingId === 'fresh_coconut') {
      label = '🥥 +COCONUT & CARDAMOM';
      color = '#FFFFFF';
    } else if (toppingId === 'green_chillies') {
      label = '🌶️ +GREEN CHILLIES';
      color = '#2ECC71';
    } else if (toppingId === 'cumin_pepper') {
      label = '🧂 +CUMIN & PEPPER';
      color = '#BDC3C7';
    }

    this.spawnFloatingBadge(label, color);
    this.draw();
    this.onStateChange?.(this.state, this.cookingProgress);
    return true;
  }

  /**
   * 3. Interactive Dosa Flip
   */
  public flipDosa(onDone?: () => void): boolean {
    if (this.state !== 'COOKING' && this.state !== 'PERFECT_ROAST') {
      return false;
    }
    if (this.isFolded || this.isPlated) return false;

    SoundFX.getInstance().playSpatulaScrape();
    SoundFX.getInstance().playDosaFlip();

    // Smooth 3D flip arc with subtle rotational tilt
    this.scene.tweens.add({
      targets: this.container,
      scaleY: 0.04,
      scaleX: 0.94,
      y: this.y - 45,
      rotation: 0.08,
      duration: 190,
      ease: 'Cubic.easeOut',
      yoyo: true,
      onYoyo: () => {
        this.isFlipped = !this.isFlipped;
        this.flipCount++;
        this.draw();
      },
      onComplete: () => {
        this.container.y = this.y;
        this.container.rotation = 0;
        this.container.scaleX = 1.0;
        this.container.scaleY = 1.0;

        // Landing sizzle ripple and squash
        SoundFX.getInstance().playSizzle(0.7);
        const landRipple = this.scene.add.circle(this.x, this.y, this.currentSpreadRadius * 0.9, THEME.colors.turmericBright, 0.45);
        this.scene.tweens.add({
          targets: landRipple,
          scaleX: 1.15,
          scaleY: 1.15,
          alpha: 0,
          duration: 260,
          onComplete: () => landRipple.destroy()
        });

        this.scene.tweens.add({
          targets: this.container,
          scaleX: 1.04,
          scaleY: 0.96,
          duration: 80,
          yoyo: true,
          ease: 'Quad.easeInOut'
        });

        this.spawnFloatingBadge(this.isFlipped ? '🔄 FLIPPED ON TAWA' : '🔄 FLIPPED BACK', THEME.colors.creamHex);
        this.onStateChange?.(this.state, this.cookingProgress);
        onDone?.();
      }
    });

    return true;
  }

  /**
   * 4. Interactive Folding Action
   */
  public foldDosa(foldType: DosaFoldType, onDone?: () => void): boolean {
    if (this.state !== 'COOKING' && this.state !== 'PERFECT_ROAST') {
      return false;
    }
    if (this.isFolded) return false;

    this.state = 'FOLDED';
    this.isFolded = true;
    this.foldType = foldType;

    SoundFX.getInstance().playSpatulaScrape();
    SoundFX.getInstance().playCrispFold();

    // Tactile 2-phase creasing snap
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 0.78,
      scaleY: 0.86,
      duration: 170,
      ease: 'Back.easeIn',
      yoyo: true,
      onYoyo: () => {
        this.draw();
      },
      onComplete: () => {
        this.scene.tweens.add({
          targets: this.container,
          scaleX: 1.03,
          scaleY: 1.03,
          duration: 100,
          yoyo: true,
          ease: 'Back.easeOut',
          onComplete: () => {
            this.container.setScale(1.0);
          }
        });

        // Golden creasing sparkle burst
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const spark = this.scene.add.circle(
            this.x + Math.cos(angle) * 35,
            this.y + Math.sin(angle) * 25,
            3,
            THEME.colors.turmericBright,
            0.9
          );
          this.scene.tweens.add({
            targets: spark,
            x: spark.x + Math.cos(angle) * 40,
            y: spark.y + Math.sin(angle) * 30,
            alpha: 0,
            scale: 0.3,
            duration: 350,
            ease: 'Cubic.easeOut',
            onComplete: () => spark.destroy()
          });
        }

        const foldNames: Record<DosaFoldType, string> = {
          cylinder: 'CYLINDRICAL FLUTE',
          triangle: 'ROYAL TRIANGLE',
          half_moon: 'HALF-MOON FOLD',
          open_face: 'OPEN-FACE PANCAKE'
        };
        this.spawnFloatingBadge(`🌯 FOLDED: ${foldNames[foldType]}`, THEME.colors.turmericBrightHex);
        this.onStateChange?.(this.state, this.cookingProgress);
        onDone?.();
      }
    });

    return true;
  }

  /**
   * 5. Move Finished Dosa onto Serving Plate (Banana Leaf Platter)
   */
  public plateDosa(targetX: number, targetY: number, onComplete?: () => void): boolean {
    if (!this.isFolded && this.state !== 'COOKING' && this.state !== 'PERFECT_ROAST') {
      return false;
    }

    if (!this.isFolded) {
      this.isFolded = true;
      this.foldType = this.foldType || 'open_face';
      this.draw();
    }

    this.state = 'PLATED';
    this.isPlated = true;

    SoundFX.getInstance().playSpatulaScrape();
    SoundFX.getInstance().playPlateThud();
    SoundFX.getInstance().playSuccessChime();

    // Smooth parabolic arc motion: lifts slightly before descending to plate
    this.scene.tweens.add({
      targets: this.container,
      x: targetX,
      y: targetY,
      scaleX: 0.74,
      scaleY: 0.74,
      duration: 460,
      ease: 'Cubic.easeInOut',
      onComplete: () => {
        // Joyful plate landing squash and sparkle ring
        this.scene.tweens.add({
          targets: this.container,
          scaleX: 0.78,
          scaleY: 0.70,
          duration: 110,
          yoyo: true,
          ease: 'Quad.easeInOut',
          onComplete: () => {
            this.container.setScale(0.74);
            this.container.setSize(260, 90);
            this.container.setInteractive({ useHandCursor: true });
            this.container.off('pointerup');
            this.container.on('pointerup', () => {
              if (this.state === 'PLATED') {
                this.onPlatedClick?.();
              }
            });
          }
        });

        // Platter golden halo
        const halo = this.scene.add.circle(targetX, targetY, 95, THEME.colors.bananaLeafGreen, 0.45);
        this.scene.tweens.add({
          targets: halo,
          scaleX: 1.25,
          scaleY: 1.25,
          alpha: 0,
          duration: 380,
          onComplete: () => halo.destroy()
        });

        this.spawnFloatingBadge('✨ PLATED ON BANANA LEAF! ✨', THEME.colors.turmericBrightHex, -45);
        this.onStateChange?.(this.state, 1.0);
        onComplete?.();
      }
    });

    return true;
  }

  /**
   * 6. Calculate Cooking Quality Score based on Recipe Requirements
   */
  public calculateQuality(recipe: Recipe): DosaCookingQuality {
    // 1. Crispiness Score (Optimal roast: 0.85 -> 1.05)
    let crispinessScore = 100;
    if (this.cookingProgress < 0.50) {
      crispinessScore = Math.max(25, Math.round(this.cookingProgress * 120));
    } else if (this.cookingProgress < 0.85) {
      crispinessScore = Math.round(70 + ((this.cookingProgress - 0.50) / 0.35) * 30);
    } else if (this.cookingProgress <= 1.05) {
      crispinessScore = 100; // Golden perfection
    } else if (this.cookingProgress <= 1.25) {
      crispinessScore = Math.round(100 - ((this.cookingProgress - 1.05) / 0.20) * 35);
    } else {
      crispinessScore = Math.max(15, Math.round(65 - (this.cookingProgress - 1.25) * 100));
    }

    // 2. Ghee Score
    const recipeNeedsGhee = recipe.ingredients.some(i => i.id === 'ghee' && i.required);
    let gheeScore = 100;
    if (recipeNeedsGhee && !this.hasGhee) {
      gheeScore = 35; // Missing ghee penalty
    } else if (!recipeNeedsGhee && this.hasGhee) {
      gheeScore = 90;
    } else {
      gheeScore = 100;
    }

    // 3. Toppings Accuracy
    const requiredToppingIds = recipe.ingredients
      .filter(i => i.required && i.id !== 'batter' && i.id !== 'ghee')
      .map(i => i.id);

    let toppingsScore = 100;
    let correctCount = 0;
    let missingCount = 0;
    let extraCount = 0;

    requiredToppingIds.forEach(id => {
      if (this.appliedToppings.has(id)) {
        correctCount++;
      } else {
        missingCount++;
      }
    });

    this.appliedToppings.forEach(id => {
      if (!requiredToppingIds.includes(id)) {
        extraCount++;
      }
    });

    if (requiredToppingIds.length > 0) {
      toppingsScore = Math.round((correctCount / requiredToppingIds.length) * 100) - (extraCount * 15);
      toppingsScore = Math.max(15, Math.min(100, toppingsScore));
    } else {
      if (this.appliedToppings.size > 0) {
        toppingsScore = Math.max(35, 100 - this.appliedToppings.size * 25);
      } else {
        toppingsScore = 100;
      }
    }

    // 4. Fold Accuracy
    let foldScore = 100;
    if (this.foldType === recipe.foldType) {
      foldScore = 100;
    } else if (!this.foldType) {
      foldScore = 60;
    } else {
      foldScore = 75;
    }

    // Flip requirement check (e.g. Uthappam)
    if (recipe.id === 'onion_uthappam' && !this.isFlipped) {
      toppingsScore = Math.max(30, toppingsScore - 30);
    }

    // Weighted Overall Score with upgrade bonus
    const baseScore = Math.round(
      crispinessScore * 0.35 +
      gheeScore * 0.20 +
      toppingsScore * 0.30 +
      foldScore * 0.15
    );
    const scoreMult = UpgradeService.getInstance().getScoreMultiplier();
    const overallScore = Math.min(100, Math.round(baseScore * scoreMult));

    let stars = 1;
    let gradeTitle = 'Decent Effort';
    if (overallScore >= 88) {
      stars = 3;
      gradeTitle = 'Mouthwatering Masterpiece!';
    } else if (overallScore >= 72) {
      stars = 2;
      gradeTitle = 'Delicious Golden Tiffin!';
    } else {
      stars = 1;
      gradeTitle = 'Decent Attempt — Keep Practicing!';
    }

    const feedbackNotes: string[] = [];
    if (crispinessScore >= 92) feedbackNotes.push('🔥 Perfect golden amber crispness');
    else if (crispinessScore < 70) feedbackNotes.push('⚠️ Adjust roasting time on tawa');

    if (this.hasGhee) feedbackNotes.push('🧈 Rich nutty desi ghee aroma');
    else if (recipeNeedsGhee) feedbackNotes.push('⚠️ Missing fragrant ghee drizzle');

    if (toppingsScore >= 90) feedbackNotes.push('✨ Accurate authentic fillings');
    else if (missingCount > 0) feedbackNotes.push('⚠️ Missing required recipe toppings');

    if (foldScore === 100) feedbackNotes.push(`🌯 Authentic ${recipe.foldType.replace('_', ' ')} fold`);

    const earnedCoins = Math.round(60 + (overallScore / 100) * 80);

    return {
      overallScore,
      stars,
      crispinessScore,
      gheeScore,
      toppingsScore,
      foldScore,
      earnedCoins,
      gradeTitle,
      feedbackNotes
    };
  }

  /**
   * Floating encouragement/feedback text
   */
  private spawnFloatingBadge(text: string, colorHex: string, yOffset: number = -85): void {
    const badge = this.scene.add.text(this.x, this.y + yOffset, text, {
      fontFamily: THEME.fonts.title,
      fontSize: '15px',
      fontStyle: 'bold',
      color: colorHex,
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    badge.setDepth(60);

    this.scene.tweens.add({
      targets: badge,
      y: this.y + yOffset - 35,
      alpha: 0,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      ease: 'Cubic.easeOut',
      onComplete: () => badge.destroy()
    });
  }

  /**
   * Clean/reset the tawa back to empty
   */
  public reset(): void {
    this.state = 'EMPTY';
    this.currentSpreadRadius = 0;
    this.totalRotation = 0;
    this.spreadProgress = 0;
    this.cookingProgress = 0;
    this.spiralHistory = [];
    this.hasGhee = false;
    this.gheeCount = 0;
    this.appliedToppings.clear();
    this.isFlipped = false;
    this.flipCount = 0;
    this.isFolded = false;
    this.foldType = null;
    this.isPlated = false;

    this.container.disableInteractive();
    this.container.off('pointerup');
    this.container.setPosition(this.x, this.y);
    this.container.setScale(1.0);
    this.container.setAlpha(1.0);
    this.container.setRotation(0);

    if (this.dollopSprite) {
      this.dollopSprite.setVisible(false);
    }

    this.dosaGraphics.clear();
    this.guideGraphics.clear();
    this.onStateChange?.(this.state, 0);
  }

  /**
   * Frame update: Handles cooking and temperature-dependent browning
   */
  public update(time: number, delta: number): void {
    if (this.state === 'COOKING' || this.state === 'PERFECT_ROAST' || this.state === 'BURNT') {
      const temp = this.getTemperature();
      const upgradeService = UpgradeService.getInstance();
      const speedMult = upgradeService.getCookingSpeedMultiplier();
      const burnBuffer = upgradeService.getBurnResistanceBuffer();
      const tempSpeed = Math.max(0.2, temp / 185) * speedMult;
      const deltaProgress = (delta / 8500) * tempSpeed;

      const prev = this.cookingProgress;
      this.cookingProgress += deltaProgress;

      // Transition to PERFECT_ROAST
      if (prev < 0.90 && this.cookingProgress >= 0.90 && this.state === 'COOKING') {
        this.state = 'PERFECT_ROAST';
        SoundFX.getInstance().playSuccessChime();
      } else if (prev < (1.30 + burnBuffer) && this.cookingProgress >= (1.30 + burnBuffer) && this.state !== 'BURNT') {
        this.state = 'BURNT';
      }

      this.draw();
      this.onStateChange?.(this.state, this.cookingProgress);
    } else if (this.state === 'POURED') {
      this.drawSwirlGuide(time);
    }
  }

  /**
   * Animated beginner spiral guide on tawa
   */
  private drawSwirlGuide(time: number): void {
    this.guideGraphics.clear();
    const pulse = (Math.sin(time * 0.005) + 1) * 0.5;

    this.guideGraphics.lineStyle(2.5, THEME.colors.turmericBright, 0.45 + pulse * 0.35);

    const maxLoops = 2.2;
    const startRadius = 35;
    const endRadius = 115;

    let prevX = 0;
    let prevY = 0;
    const steps = 36;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = (t * maxLoops * Math.PI * 2) + (time * 0.002);
      const r = startRadius + t * (endRadius - startRadius);
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;

      if (i === 0) {
        prevX = px;
        prevY = py;
      } else {
        if (i % 2 === 0) {
          this.guideGraphics.lineBetween(prevX, prevY, px, py);
        }
        prevX = px;
        prevY = py;
      }
    }
  }

  /**
   * Main rendering routine for the procedural crepe
   */
  private draw(): void {
    this.guideGraphics.clear();
    this.dosaGraphics.clear();

    if (this.state === 'EMPTY') {
      return;
    }

    if (this.state === 'POURED') {
      return;
    }

    const g = this.dosaGraphics;
    const colors = this.calculateRoastColors(this.cookingProgress);

    // If folded, render the distinct folded geometry
    if (this.isFolded && this.foldType) {
      this.drawFoldedDosa(g, colors);
      return;
    }

    // Flat Crepe on Tawa
    const r = this.currentSpreadRadius;

    // 1. Outer Soft Shadow on hot cast iron
    g.fillStyle(0x000000, 0.42);
    g.fillCircle(0, 3, r + 1);

    // 2. Base Crepe Disc with Organic Wavy Lacy Circumference
    const points: Phaser.Math.Vector2[] = [];
    const segments = 36;
    for (let i = 0; i <= segments; i++) {
      const idx = i % segments;
      const a = (i / segments) * Math.PI * 2;
      const jitter = this.edgeJitter[idx] * (r / this.maxRadius);
      const dist = r + jitter;
      points.push(new Phaser.Math.Vector2(Math.cos(a) * dist, Math.sin(a) * dist));
    }

    // Fill main batter body
    g.fillStyle(colors.baseColor, 1.0);
    g.fillPoints(points, true);

    // 3. Concentric Roasting Gradients
    if (this.cookingProgress > 0.15) {
      g.fillStyle(colors.hotCenterColor, 0.75);
      g.fillCircle(0, 0, r * 0.72);

      g.fillStyle(colors.coreRoastColor, 0.85);
      g.fillCircle(0, 0, r * 0.42);
    }

    // 4. Iconic South Indian Concentric Spiral Ladle Ridges
    this.drawSpiralRidges(g, r, colors);

    // 5. Crispy Fermentation Micro-Pores / Bubble Craters
    this.drawBubbleCraters(g, r, colors);

    // 6. Paper-Thin Crispy Scalloped Rim
    g.lineStyle(2.2, colors.rimColor, 0.95);
    g.strokePoints(points, true);

    // 7. Render Toppings & Ingredients on Flat Dosa
    this.drawFlatIngredients(g, r);

    // 8. Desi Ghee Glisten Sheen & Drops
    if (this.hasGhee) {
      // Golden shimmering droplets around perimeter
      g.fillStyle(0xffc107, 0.85);
      for (let d = 0; d < 14; d++) {
        const da = (d / 14) * Math.PI * 2 + 0.2;
        const dr = r * 0.86;
        g.fillCircle(Math.cos(da) * dr, Math.sin(da) * dr, 3.2);
      }

      // Golden ghee sheen arc
      g.fillStyle(0xffffff, 0.25);
      g.beginPath();
      g.arc(-r * 0.2, -r * 0.2, r * 0.5, -0.8, 0.6);
      g.arc(-r * 0.2, -r * 0.2, r * 0.38, 0.6, -0.8, true);
      g.closePath();
      g.fill();
    }
  }

  /**
   * Draw toppings and fillings on flat roasting dosa
   */
  private drawFlatIngredients(g: Phaser.GameObjects.Graphics, currentR: number): void {
    // 1. Spiced Potato Masala (oblong central filling mound)
    if (this.appliedToppings.has('potato_masala')) {
      // Warm turmeric yellow filling mound
      g.fillStyle(0xf1c40f, 0.95);
      g.fillEllipse(0, 0, 72, 28);

      g.fillStyle(0xd4ac0d, 0.9);
      g.fillCircle(-16, -3, 8);
      g.fillCircle(16, 2, 8);
      g.fillCircle(0, 4, 7);

      // Sautéed mustard seeds
      g.fillStyle(0x111111, 0.92);
      g.fillCircle(-10, -5, 1.6);
      g.fillCircle(8, 6, 1.6);
      g.fillCircle(-2, -2, 1.6);
      g.fillCircle(20, -1, 1.6);

      // Fresh green curry leaf flecks
      g.fillStyle(0x27ae60, 0.95);
      g.fillEllipse(-12, 4, 5, 2.5);
      g.fillEllipse(10, -4, 6, 3);
    }

    // 2. Gunpowder Idli Podi Dusting
    if (this.appliedToppings.has('idli_podi')) {
      if (this.hasGhee) {
        // Bloomed dark maroon spice paste sheen
        g.fillStyle(0x78281f, 0.45);
        g.fillCircle(0, 0, currentR * 0.68);
      }

      // Red/maroon spice specks
      for (let i = 0; i < 48; i++) {
        const pa = (i * 2.39996) % (Math.PI * 2);
        const pr = (Math.sqrt((i + 1) / 48) * currentR * 0.75);
        g.fillStyle(i % 2 === 0 ? 0x900c3f : 0xc0392b, 0.85);
        g.fillCircle(Math.cos(pa) * pr, Math.sin(pa) * pr, 2.0);
      }
    }

    // 3. Sliced Shallots & Green Chillies
    if (this.appliedToppings.has('shallots')) {
      for (let s = 0; s < 16; s++) {
        const sa = (s * 1.618) * Math.PI * 2;
        const sr = 22 + (s * 5) % (currentR * 0.65);
        const sx = Math.cos(sa) * sr;
        const sy = Math.sin(sa) * sr;

        // Shallot ring
        g.lineStyle(2, this.isFlipped ? 0xb9770e : 0xaf7ac5, 0.88);
        g.strokeEllipse(sx, sy, 10, 6);

        // Green chilli dot
        if (s % 3 === 0) {
          g.fillStyle(0x2ecc71, 0.9);
          g.fillCircle(sx + 3, sy - 2, 2.8);
        }
      }
    }

    // 4. Mysore Red Garlic Chutney Lacquer
    if (this.appliedToppings.has('mysore_paste')) {
      g.fillStyle(0x900c3f, 0.62);
      g.fillCircle(0, 0, currentR * 0.72);
      g.fillStyle(0xc0392b, 0.75);
      g.fillCircle(0, 0, currentR * 0.45);

      for (let i = 0; i < 28; i++) {
        const pa = (i * 2.39996) % (Math.PI * 2);
        const pr = Math.sqrt((i + 1) / 28) * currentR * 0.62;
        g.fillStyle(i % 3 === 0 ? 0xf9e79f : 0xe74c3c, 0.9);
        g.fillCircle(Math.cos(pa) * pr, Math.sin(pa) * pr, 1.8);
      }
    }

    // 5. Chettinad Spicy Malai Paneer
    if (this.appliedToppings.has('paneer_masala')) {
      g.fillStyle(0xb7950b, 0.8);
      g.fillEllipse(0, 0, 75, 32);

      const pCubes = [
        { x: -18, y: -4, w: 14, h: 11 },
        { x: 0, y: 5, w: 16, h: 12 },
        { x: 18, y: -3, w: 15, h: 12 },
        { x: -6, y: -10, w: 12, h: 10 },
        { x: 12, y: 8, w: 13, h: 10 }
      ];
      pCubes.forEach(c => {
        g.fillStyle(0xfffdf5, 0.95);
        g.fillRect(c.x - c.w / 2, c.y - c.h / 2, c.w, c.h);
        g.lineStyle(1, 0x935116, 0.8);
        g.strokeRect(c.x - c.w / 2, c.y - c.h / 2, c.w, c.h);
      });

      g.fillStyle(0x17202a, 0.95);
      for (let p = 0; p < 14; p++) {
        const a = (p * 2.1) % (Math.PI * 2);
        const d = 5 + (p * 4) % 30;
        g.fillCircle(Math.cos(a) * d, Math.sin(a) * d * 0.6, 1.6);
      }
    }

    // 6. Grated Amul Cheese Snowfall
    if (this.appliedToppings.has('amul_cheese')) {
      for (let i = 0; i < 42; i++) {
        const ca = (i * 2.39996) % (Math.PI * 2);
        const cd = Math.sqrt((i + 1) / 42) * currentR * 0.72;
        const cx = Math.cos(ca) * cd;
        const cy = Math.sin(ca) * cd;
        g.fillStyle(i % 2 === 0 ? 0xfef9e7 : 0xf7dc6f, 0.92);
        g.fillRect(cx - 5, cy - 1.5, 10, 3);
      }
    }

    // 7. Sweet Grated Coconut & Cardamom
    if (this.appliedToppings.has('fresh_coconut')) {
      for (let i = 0; i < 48; i++) {
        const ca = (i * 2.39996) % (Math.PI * 2);
        const cd = Math.sqrt((i + 1) / 48) * currentR * 0.70;
        const cx = Math.cos(ca) * cd;
        const cy = Math.sin(ca) * cd;
        g.fillStyle(0xffffff, 0.95);
        g.fillEllipse(cx, cy, 3.5, 1.8);
        if (i % 4 === 0) {
          g.fillStyle(0x27ae60, 0.9);
          g.fillCircle(cx + 2, cy - 1, 1.4);
        }
      }
    }

    // 8. Cumin & Black Peppercorns
    if (this.appliedToppings.has('cumin_pepper')) {
      for (let i = 0; i < 24; i++) {
        const ca = (i * 1.9) % (Math.PI * 2);
        const cd = Math.sqrt((i + 1) / 24) * currentR * 0.75;
        g.fillStyle(i % 2 === 0 ? 0x17202a : 0x784212, 0.9);
        g.fillCircle(Math.cos(ca) * cd, Math.sin(ca) * cd, 1.8);
      }
    }

    // 9. Reverse side browned markings if flipped
    if (this.isFlipped) {
      g.fillStyle(0x873600, 0.35);
      g.fillCircle(10, -15, 35);
      g.fillCircle(-25, 20, 28);
    }
  }

  /**
   * Draw authentic South Indian folded dosa shapes
   */
  private drawFoldedDosa(g: Phaser.GameObjects.Graphics, colors: ReturnType<typeof this.calculateRoastColors>): void {
    switch (this.foldType) {
      case 'cylinder': {
        // Plain Golden Ghee Roast Flute / Cylindrical Roll
        const w = 240;
        const h = 54;

        // Drop shadow
        g.fillStyle(0x000000, 0.45);
        g.fillRoundedRect(-w / 2 + 3, -h / 2 + 7, w, h, 20);

        // Cylinder golden body
        g.fillStyle(colors.baseColor, 1.0);
        g.fillRoundedRect(-w / 2, -h / 2, w, h, 20);

        // Center golden roasting bands
        g.fillStyle(colors.hotCenterColor, 0.8);
        g.fillRoundedRect(-w / 2 + 15, -h / 2 + 10, w - 30, h - 20, 12);

        // Longitudinal crispy ridges
        g.lineStyle(2.8, colors.ridgeDark, 0.8);
        g.lineBetween(-w / 2 + 20, -h / 2 + 16, w / 2 - 20, -h / 2 + 16);
        g.lineBetween(-w / 2 + 25, 0, w / 2 - 25, 0);
        g.lineBetween(-w / 2 + 20, h / 2 - 16, w / 2 - 20, h / 2 - 16);

        // Open crispy rolled ends (ellipses)
        g.fillStyle(colors.ridgeDark, 0.7);
        g.fillEllipse(-w / 2 + 4, 0, 7, 20);
        g.fillEllipse(w / 2 - 4, 0, 7, 20);

        // Outer crisp rim
        g.lineStyle(2.2, colors.rimColor, 0.95);
        g.strokeRoundedRect(-w / 2, -h / 2, w, h, 20);

        // Ghee golden sheen along top spine
        if (this.hasGhee) {
          g.fillStyle(0xffffff, 0.28);
          g.fillRoundedRect(-w / 2 + 20, -h / 2 + 6, w - 40, 8, 4);
        }
        break;
      }

      case 'triangle': {
        // Royal Masala Dosa Triangular Envelope
        const p1 = new Phaser.Math.Vector2(0, -92);
        const p2 = new Phaser.Math.Vector2(-112, 62);
        const p3 = new Phaser.Math.Vector2(112, 62);

        // Drop shadow
        g.fillStyle(0x000000, 0.45);
        g.fillTriangle(p1.x, p1.y + 6, p2.x, p2.y + 6, p3.x, p3.y + 6);

        // Triangle body
        g.fillStyle(colors.baseColor, 1.0);
        g.fillTriangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

        // Inner hot core
        g.fillStyle(colors.hotCenterColor, 0.75);
        g.fillCircle(0, 10, 48);

        // Overlapping folding seams
        g.lineStyle(3.2, colors.ridgeDark, 0.85);
        g.lineBetween(p2.x, p2.y, 22, -10);
        g.lineBetween(p3.x, p3.y, -22, -10);

        // Crisp border
        g.lineStyle(2.4, colors.rimColor, 0.95);
        g.strokeTriangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);

        // Peeking fillings from the top corner opening!
        if (this.appliedToppings.has('mysore_paste')) {
          g.fillStyle(0xc0392b, 0.9);
          g.fillEllipse(0, -82, 14, 8);
        }
        if (this.appliedToppings.has('paneer_masala')) {
          g.fillStyle(0xfffdf5, 0.95);
          g.fillRect(-7, -84, 14, 11);
          g.fillStyle(0x17202a, 0.9);
          g.fillCircle(-2, -80, 1.4);
        }
        if (this.appliedToppings.has('potato_masala')) {
          g.fillStyle(0xf1c40f, 0.95);
          g.fillEllipse(0, -78, 16, 9);
          g.fillStyle(0x27ae60, 0.95);
          g.fillCircle(-2, -78, 2.0);
          g.fillStyle(0x111111, 0.9);
          g.fillCircle(3, -77, 1.4);
        }
        break;
      }

      case 'half_moon': {
        // Ghee Podi Roast / Cheese / Coconut Half-Moon Fold
        const r = 118;
        // Drop shadow
        g.fillStyle(0x000000, 0.45);
        g.beginPath();
        g.arc(0, 16, r, Math.PI, 0, false);
        g.closePath();
        g.fillPath();

        // Half moon body
        g.fillStyle(colors.baseColor, 1.0);
        g.beginPath();
        g.arc(0, 10, r, Math.PI, 0, false);
        g.closePath();
        g.fillPath();

        // Hot center
        g.fillStyle(colors.hotCenterColor, 0.75);
        g.beginPath();
        g.arc(0, 10, r * 0.65, Math.PI, 0, false);
        g.closePath();
        g.fillPath();

        // Concentric spiral arcs
        g.lineStyle(2.8, colors.ridgeDark, 0.8);
        g.beginPath();
        g.arc(0, 10, r * 0.4, Math.PI, 0, false);
        g.strokePath();

        // Crisp bottom crease
        g.lineStyle(3.2, colors.ridgeDark, 0.95);
        g.lineBetween(-r, 10, r, 10);

        // Lacy outer rim
        g.lineStyle(2.2, colors.rimColor, 0.95);
        g.beginPath();
        g.arc(0, 10, r, Math.PI, 0, false);
        g.strokePath();

        // Spices, cheese, or coconut peeking out along the seam
        if (this.appliedToppings.has('idli_podi')) {
          g.fillStyle(0x900c3f, 0.9);
          g.fillRoundedRect(-75, 8, 150, 6, 3);
        }
        if (this.appliedToppings.has('amul_cheese')) {
          g.fillStyle(0xfef9e7, 0.95);
          g.fillRoundedRect(-85, 8, 170, 7, 3);
          g.fillStyle(0x2ecc71, 0.9);
          g.fillCircle(-15, 11, 2.5);
          g.fillCircle(25, 11, 2.5);
        }
        if (this.appliedToppings.has('fresh_coconut')) {
          g.fillStyle(0xffffff, 0.95);
          g.fillRoundedRect(-70, 8, 140, 6, 3);
          g.fillStyle(0x27ae60, 0.9);
          g.fillCircle(0, 11, 1.8);
        }
        break;
      }

      case 'open_face':
      default: {
        // Open Face Uthappam pancake
        const r = 115;
        g.fillStyle(0x000000, 0.42);
        g.fillCircle(0, 4, r);

        g.fillStyle(colors.baseColor, 1.0);
        g.fillCircle(0, 0, r);

        g.fillStyle(colors.hotCenterColor, 0.8);
        g.fillCircle(0, 0, r * 0.65);

        this.drawFlatIngredients(g, r);

        g.lineStyle(2.2, colors.rimColor, 0.95);
        g.strokeCircle(0, 0, r);
        break;
      }
    }
  }

  /**
   * Draw the authentic spiral grooves created by the ladle bottom
   */
  private drawSpiralRidges(
    g: Phaser.GameObjects.Graphics,
    currentR: number,
    colors: { ridgeColor: number; ridgeDark: number }
  ): void {
    const rings = 4;
    for (let ring = 1; ring <= rings; ring++) {
      const ringRadius = (ring / (rings + 0.5)) * currentR;
      if (ringRadius < 15) continue;

      g.lineStyle(3.2, colors.ridgeDark, 0.72);
      g.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.2) {
        const waviness = Math.sin(a * 4 + ring) * 1.5;
        const px = Math.cos(a) * (ringRadius + waviness);
        const py = Math.sin(a) * (ringRadius + waviness);
        if (a === 0) g.moveTo(px, py);
        else g.lineTo(px, py);
      }
      g.strokePath();

      g.lineStyle(1.6, colors.ridgeColor, 0.85);
      g.strokeCircle(0, -0.8, ringRadius);
    }
  }

  /**
   * Draw fermentation micro-aeration holes
   */
  private drawBubbleCraters(
    g: Phaser.GameObjects.Graphics,
    currentR: number,
    colors: { poreColor: number; poreHighlight: number }
  ): void {
    if (this.cookingProgress < 0.1) return;

    for (const b of this.bubbles) {
      const br = b.normR * currentR;
      if (br > currentR - 6) continue;

      const bx = Math.cos(b.angle) * br;
      const by = Math.sin(b.angle) * br;

      g.fillStyle(colors.poreColor, b.opacity * 0.88);
      g.fillCircle(bx, by, b.size);

      g.fillStyle(colors.poreHighlight, 0.6);
      g.fillCircle(bx - 0.6, by - 0.6, b.size * 0.4);
    }
  }

  /**
   * Interpolate authentic South Indian dosa roasting colors
   */
  private calculateRoastColors(p: number): {
    baseColor: number;
    hotCenterColor: number;
    coreRoastColor: number;
    ridgeColor: number;
    ridgeDark: number;
    rimColor: number;
    poreColor: number;
    poreHighlight: number;
  } {
    if (p <= 0.35) {
      const t = p / 0.35;
      const base = this.lerpColor(0xfffdf5, 0xfcf4d7, t);
      const center = this.lerpColor(0xfbf3d6, 0xf8e8af, t);
      const core = this.lerpColor(0xf6e7ba, 0xefd27e, t);
      const ridge = this.lerpColor(0xf2e4b8, 0xdfb958, t);
      const ridgeD = this.lerpColor(0xe5d299, 0xc79d38, t);
      const rim = this.lerpColor(0xf9eed0, 0xdfba64, t);
      const pore = this.lerpColor(0xe0d0a5, 0x9c7a26, t);
      return {
        baseColor: base,
        hotCenterColor: center,
        coreRoastColor: core,
        ridgeColor: ridge,
        ridgeDark: ridgeD,
        rimColor: rim,
        poreColor: pore,
        poreHighlight: 0xffffff
      };
    } else if (p <= 0.75) {
      const t = (p - 0.35) / 0.40;
      const base = this.lerpColor(0xfcf4d7, 0xf6be5c, t);
      const center = this.lerpColor(0xf8e8af, 0xe59628, t);
      const core = this.lerpColor(0xefd27e, 0xce7a16, t);
      const ridge = this.lerpColor(0xdfb958, 0xb8670b, t);
      const ridgeD = this.lerpColor(0xc79d38, 0x934c06, t);
      const rim = this.lerpColor(0xdfba64, 0xb8650e, t);
      const pore = this.lerpColor(0x9c7a26, 0x6e3805, t);
      return {
        baseColor: base,
        hotCenterColor: center,
        coreRoastColor: core,
        ridgeColor: ridge,
        ridgeDark: ridgeD,
        rimColor: rim,
        poreColor: pore,
        poreHighlight: 0xffe49e
      };
    } else if (p <= 1.1) {
      const t = (p - 0.75) / 0.35;
      const base = this.lerpColor(0xf6be5c, 0xdd7e1b, t);
      const center = this.lerpColor(0xe59628, 0xbf5b0c, t);
      const core = this.lerpColor(0xce7a16, 0x9d4107, t);
      const ridge = this.lerpColor(0xb8670b, 0x823204, t);
      const ridgeD = this.lerpColor(0x934c06, 0x622302, t);
      const rim = this.lerpColor(0xb8650e, 0x7a3005, t);
      const pore = this.lerpColor(0x6e3805, 0x3d1702, t);
      return {
        baseColor: base,
        hotCenterColor: center,
        coreRoastColor: core,
        ridgeColor: ridge,
        ridgeDark: ridgeD,
        rimColor: rim,
        poreColor: pore,
        poreHighlight: 0xffd075
      };
    } else {
      const t = Math.min(1.0, (p - 1.1) / 0.3);
      const base = this.lerpColor(0xdd7e1b, 0x6e2c00, t);
      const center = this.lerpColor(0xbf5b0c, 0x4d1c00, t);
      const core = this.lerpColor(0x9d4107, 0x331200, t);
      const ridge = this.lerpColor(0x823204, 0x240c00, t);
      const ridgeD = this.lerpColor(0x622302, 0x1a0800, t);
      const rim = this.lerpColor(0x7a3005, 0x2b0d00, t);
      const pore = this.lerpColor(0x3d1702, 0x110500, t);
      return {
        baseColor: base,
        hotCenterColor: center,
        coreRoastColor: core,
        ridgeColor: ridge,
        ridgeDark: ridgeD,
        rimColor: rim,
        poreColor: pore,
        poreHighlight: 0xa06030
      };
    }
  }

  private lerpColor(c1: number, c2: number, t: number): number {
    const r1 = (c1 >> 16) & 0xff;
    const g1 = (c1 >> 8) & 0xff;
    const b1 = c1 & 0xff;

    const r2 = (c2 >> 16) & 0xff;
    const g2 = (c2 >> 8) & 0xff;
    const b2 = c2 & 0xff;

    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    return (r << 16) | (g << 8) | b;
  }

  // Getters
  public getState(): DosaState {
    return this.state;
  }

  public getCookingProgress(): number {
    return this.cookingProgress;
  }

  public getSpreadProgress(): number {
    return this.spreadProgress;
  }

  public getCurrentRadius(): number {
    return this.currentSpreadRadius;
  }

  public getHasGhee(): boolean {
    return this.hasGhee;
  }

  public getAppliedToppings(): Set<string> {
    return this.appliedToppings;
  }

  public getIsFlipped(): boolean {
    return this.isFlipped;
  }

  public getIsFolded(): boolean {
    return this.isFolded;
  }

  public getFoldType(): DosaFoldType | null {
    return this.foldType;
  }

  public getIsPlated(): boolean {
    return this.isPlated;
  }

  public getStageDescription(): string {
    switch (this.state) {
      case 'EMPTY':
        return 'DRAG LADLE TO HOT TAWA';
      case 'POURED':
        return 'SWIRL SPIRAL FROM CENTER OUTWARD';
      case 'SPREADING':
        return `SPREADING: ${Math.round(this.spreadProgress * 100)}% (KEEP CIRCLING)`;
      case 'COOKING': {
        const pct = Math.round(this.cookingProgress * 100);
        if (pct < 35) return `ROASTING: WET BATTER (${pct}%)`;
        if (pct < 75) return `ROASTING: CRISPING UP (${pct}%)`;
        return `ROASTING: GOLDEN AMBER (${pct}%)`;
      }
      case 'PERFECT_ROAST':
        return '★ PERFECT GOLDEN ROAST! ★ (ADD GHEE & FOLD)';
      case 'BURNT':
        return '⚠️ OVERDONE! CLEAN TAWA FOR NEXT DOSA';
      case 'FOLDED':
        return `FOLDED (${this.foldType?.toUpperCase()}) • READY TO SERVE ON BANANA LEAF`;
      case 'PLATED':
        return '✨ SERVED FRESH ON BANANA LEAF PLATTER! ✨';
    }
  }

  public getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  public setOnPlatedClick(cb: () => void): void {
    this.onPlatedClick = cb;
  }
}
