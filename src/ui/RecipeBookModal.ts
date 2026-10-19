import Phaser from 'phaser';
import { THEME } from '../config/theme';
import { SoundFX } from '../audio/SoundFX';
import { RecipeService, RECIPES } from '../services/RecipeRegistry';
import { Recipe } from '../types/recipe';

export class RecipeBookModal extends Phaser.GameObjects.Container {
  private backdrop: Phaser.GameObjects.Rectangle;
  private panel: Phaser.GameObjects.Container;
  private selectedRecipe: Recipe;
  private recipeButtons: Phaser.GameObjects.Container[] = [];
  private detailsContainer: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, onClose: () => void) {
    super(scene, 0, 0);

    const { width, height } = THEME.dimensions;
    this.selectedRecipe = RECIPES[0];

    // Dark backdrop overlay
    this.backdrop = scene.add.rectangle(width / 2, height / 2, width, height, 0x0a0502, 0.78);
    this.backdrop.setInteractive();
    this.add(this.backdrop);

    // Main Modal Panel
    this.panel = scene.add.container(width / 2, height / 2);
    this.add(this.panel);

    const modalW = 1100;
    const modalH = 610;

    // Panel Board (Deep rosewood background with brass border)
    const boardGraphics = scene.add.graphics();
    // Drop Shadow
    boardGraphics.fillStyle(0x000000, 0.55);
    boardGraphics.fillRoundedRect(-modalW / 2 + 10, -modalH / 2 + 14, modalW, modalH, 20);

    // Teak Wood base
    boardGraphics.fillStyle(THEME.colors.teakWood, 1);
    boardGraphics.fillRoundedRect(-modalW / 2, -modalH / 2, modalW, modalH, 20);

    // Warm Parchment inner surface
    boardGraphics.fillStyle(THEME.colors.creamWarm, 1);
    boardGraphics.fillRoundedRect(-modalW / 2 + 16, -modalH / 2 + 16, modalW - 32, modalH - 32, 14);

    // Divider line between left list and right details
    boardGraphics.lineStyle(2, THEME.colors.terracotta, 0.35);
    boardGraphics.lineBetween(-modalW / 2 + 300, -modalH / 2 + 25, -modalW / 2 + 300, modalH / 2 - 25);

    // Brass outer border
    boardGraphics.lineStyle(4, THEME.colors.brass, 0.95);
    boardGraphics.strokeRoundedRect(-modalW / 2, -modalH / 2, modalW, modalH, 20);

    // Inner decorative gold line
    boardGraphics.lineStyle(1.5, THEME.colors.turmericGold, 0.6);
    boardGraphics.strokeRoundedRect(-modalW / 2 + 8, -modalH / 2 + 8, modalW - 16, modalH - 16, 16);

    this.panel.add(boardGraphics);

    // Header Title
    const headerTitle = scene.add.text(-modalW / 2 + 26, -modalH / 2 + 26, 'ROYAL RECIPE BOOK', {
      fontFamily: THEME.fonts.title,
      fontSize: '26px',
      color: THEME.colors.teakWoodHex
    });
    this.panel.add(headerTitle);

    const subHeader = scene.add.text(-modalW / 2 + 26, -modalH / 2 + 58, 'Master authentic South Indian tawa creations', {
      fontFamily: THEME.fonts.body,
      fontSize: '12px',
      color: THEME.colors.terracottaHex
    });
    this.panel.add(subHeader);

    // Close Button
    const closeBtn = scene.add.image(modalW / 2 - 32, -modalH / 2 + 32, 'icon_close');
    closeBtn.setInteractive({ useHandCursor: true });
    closeBtn.on('pointerover', () => closeBtn.setScale(1.15));
    closeBtn.on('pointerout', () => closeBtn.setScale(1.0));
    closeBtn.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.closeModal(onClose);
    });
    this.panel.add(closeBtn);

    // Details Container (Right side)
    this.detailsContainer = scene.add.container(-modalW / 2 + 320, -modalH / 2 + 30);
    this.panel.add(this.detailsContainer);

    // Build Left Sidebar Recipe List
    this.buildRecipeList(scene, -modalW / 2 + 24, -modalH / 2 + 90);

    // Render Initial Selected Recipe
    this.renderRecipeDetails(scene);

    // Spawn Animation
    this.panel.setScale(0.85);
    this.panel.setAlpha(0);
    scene.tweens.add({
      targets: this.panel,
      scaleX: 1,
      scaleY: 1,
      alpha: 1,
      duration: 220,
      ease: 'Back.easeOut'
    });

    scene.add.existing(this);
  }

  private buildRecipeList(scene: Phaser.Scene, startX: number, startY: number): void {
    const registry = RecipeService.getInstance();
    const itemW = 255;
    const itemH = 68;

    RECIPES.forEach((recipe, idx) => {
      const y = startY + idx * (itemH + 8);
      const itemContainer = scene.add.container(startX, y);

      const bg = scene.add.graphics();
      const isSelected = recipe.id === this.selectedRecipe.id;
      const isUnlocked = registry.isUnlocked(recipe.id);

      this.drawItemBg(bg, itemW, itemH, isSelected, isUnlocked);
      itemContainer.add(bg);

      // Recipe Title
      const title = scene.add.text(12, 12, recipe.name, {
        fontFamily: THEME.fonts.title,
        fontSize: '15px',
        color: isSelected ? THEME.colors.creamHex : THEME.colors.teakWoodHex
      });
      itemContainer.add(title);

      // Tamil subtitle or tagline
      const subtitle = scene.add.text(12, 34, isUnlocked ? recipe.tamilName : '🔒 Locked', {
        fontFamily: THEME.fonts.body,
        fontSize: '11.5px',
        color: isSelected ? THEME.colors.turmericBrightHex : (isUnlocked ? THEME.colors.curryGreenHex : '#888888')
      });
      itemContainer.add(subtitle);

      // Prep Time Badge
      const timeBadge = scene.add.text(itemW - 12, 14, `⏱ ${recipe.cookingTimeSec}s`, {
        fontFamily: THEME.fonts.body,
        fontSize: '11px',
        fontStyle: 'bold',
        color: isSelected ? THEME.colors.creamHex : THEME.colors.terracottaHex
      }).setOrigin(1, 0);
      itemContainer.add(timeBadge);

      // Make clickable
      itemContainer.setSize(itemW, itemH);
      itemContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, itemW, itemH), Phaser.Geom.Rectangle.Contains);

      itemContainer.on('pointerover', () => {
        if (recipe.id !== this.selectedRecipe.id) {
          bg.clear();
          bg.fillStyle(THEME.colors.turmeric, 0.25);
          bg.fillRoundedRect(0, 0, itemW, itemH, 8);
          bg.lineStyle(1.5, THEME.colors.turmeric, 0.8);
          bg.strokeRoundedRect(0, 0, itemW, itemH, 8);
        }
      });

      itemContainer.on('pointerout', () => {
        if (recipe.id !== this.selectedRecipe.id) {
          bg.clear();
          this.drawItemBg(bg, itemW, itemH, false, isUnlocked);
        }
      });

      itemContainer.on('pointerdown', () => {
        SoundFX.getInstance().playPageTurn();
        this.selectedRecipe = recipe;
        this.refreshListSelection();
        this.renderRecipeDetails(scene);
      });

      this.panel.add(itemContainer);
      this.recipeButtons.push(itemContainer);
    });
  }

  private drawItemBg(g: Phaser.GameObjects.Graphics, w: number, h: number, selected: boolean, unlocked: boolean): void {
    if (selected) {
      g.fillStyle(THEME.colors.teakWood, 1);
      g.fillRoundedRect(0, 0, w, h, 8);
      g.lineStyle(2, THEME.colors.turmeric, 1);
      g.strokeRoundedRect(0, 0, w, h, 8);
    } else {
      g.fillStyle(unlocked ? 0xEDE2CF : 0xE0D3BD, 0.9);
      g.fillRoundedRect(0, 0, w, h, 8);
      g.lineStyle(1.5, unlocked ? THEME.colors.terracotta : 0xBBBBBB, 0.4);
      g.strokeRoundedRect(0, 0, w, h, 8);
    }
  }

  private refreshListSelection(): void {
    const registry = RecipeService.getInstance();
    RECIPES.forEach((recipe, idx) => {
      const container = this.recipeButtons[idx];
      const bg = container.getAt(0) as Phaser.GameObjects.Graphics;
      const title = container.getAt(1) as Phaser.GameObjects.Text;
      const subtitle = container.getAt(2) as Phaser.GameObjects.Text;
      const timeBadge = container.getAt(3) as Phaser.GameObjects.Text;

      const isSelected = recipe.id === this.selectedRecipe.id;
      const isUnlocked = registry.isUnlocked(recipe.id);

      bg.clear();
      this.drawItemBg(bg, 255, 68, isSelected, isUnlocked);

      title.setColor(isSelected ? THEME.colors.creamHex : THEME.colors.teakWoodHex);
      subtitle.setColor(isSelected ? THEME.colors.turmericBrightHex : (isUnlocked ? THEME.colors.curryGreenHex : '#888888'));
      timeBadge.setColor(isSelected ? THEME.colors.creamHex : THEME.colors.terracottaHex);
    });
  }

  private renderRecipeDetails(scene: Phaser.Scene): void {
    this.detailsContainer.removeAll(true);
    const r = this.selectedRecipe;

    // LEFT SECTION OF DETAILS: Dish Info & Badges
    const textW = 440;

    // Title
    const title = scene.add.text(0, 0, r.name, {
      fontFamily: THEME.fonts.title,
      fontSize: '26px',
      color: THEME.colors.teakWoodHex
    });
    this.detailsContainer.add(title);

    // Tamil Name & Tagline
    const sub = scene.add.text(0, 32, `${r.tamilName} • "${r.tagline}"`, {
      fontFamily: THEME.fonts.body,
      fontSize: '12px',
      fontStyle: 'bold',
      color: THEME.colors.terracottaHex
    });
    this.detailsContainer.add(sub);

    // Badges Row
    const diffStars = '★'.repeat(r.difficulty) + '☆'.repeat(3 - r.difficulty);
    const badgesText = scene.add.text(
      0,
      56,
      `Difficulty: ${diffStars}   •   ⚡ ${r.calories}   •   📐 Fold: ${r.foldType.replace('_', ' ').toUpperCase()}`,
      {
        fontFamily: THEME.fonts.body,
        fontSize: '11.5px',
        fontStyle: 'bold',
        color: THEME.colors.turmericGoldHex
      }
    );
    this.detailsContainer.add(badgesText);

    // Description
    const desc = scene.add.text(0, 80, r.description, {
      fontFamily: THEME.fonts.body,
      fontSize: '12px',
      color: '#3A271B',
      wordWrap: { width: textW },
      lineSpacing: 3
    });
    this.detailsContainer.add(desc);

    // RIGHT SECTION OF DETAILS: Photorealistic Dish Image
    const photoX = 575;
    const photoY = 68;
    const photoW = 270;
    const photoH = 185;

    // Frame shadow
    const photoShadow = scene.add.graphics();
    photoShadow.fillStyle(0x000000, 0.4);
    photoShadow.fillRoundedRect(photoX - photoW / 2 + 4, photoY - photoH / 2 + 6, photoW, photoH, 10);
    this.detailsContainer.add(photoShadow);

    // Photo Image (Either loaded photo or generated photo card)
    const photoKey = scene.textures.exists(r.imageKey) ? r.imageKey : 'photo_masala_dosa';
    const photoImg = scene.add.image(photoX, photoY, photoKey);
    photoImg.setDisplaySize(photoW, photoH);

    // Create mask for rounded corners
    const maskShape = scene.make.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillRoundedRect(
      this.detailsContainer.x + this.panel.x + photoX - photoW / 2,
      this.detailsContainer.y + this.panel.y + photoY - photoH / 2,
      photoW,
      photoH,
      10
    );
    const mask = maskShape.createGeometryMask();
    photoImg.setMask(mask);
    this.detailsContainer.add(photoImg);

    // Brass/Gold Border Frame around Photo
    const photoBorder = scene.add.graphics();
    photoBorder.lineStyle(3, THEME.colors.brass, 0.95);
    photoBorder.strokeRoundedRect(photoX - photoW / 2, photoY - photoH / 2, photoW, photoH, 10);
    this.detailsContainer.add(photoBorder);

    // Caption under photo
    const photoCap = scene.add.text(photoX, photoY + photoH / 2 + 10, '100% AUTHENTIC RECIPE PHOTOGRAPH', {
      fontFamily: THEME.fonts.body,
      fontSize: '9.5px',
      fontStyle: 'bold',
      color: THEME.colors.terracottaHex,
      letterSpacing: 1
    }).setOrigin(0.5, 0);
    this.detailsContainer.add(photoCap);

    // SECTION: Essential Ingredients (2 columns)
    const ingTitle = scene.add.text(0, 142, 'ESSENTIAL INGREDIENTS', {
      fontFamily: THEME.fonts.title,
      fontSize: '14px',
      color: THEME.colors.terracottaHex
    });
    this.detailsContainer.add(ingTitle);

    let ingY = 166;
    r.ingredients.forEach((ing, i) => {
      const colX = (i % 2 === 0) ? 0 : 225;
      const currentY = ingY + Math.floor(i / 2) * 22;

      const ingText = scene.add.text(colX, currentY, `${ing.icon} ${ing.name}: ${ing.amountText}`, {
        fontFamily: THEME.fonts.body,
        fontSize: '11px',
        color: THEME.colors.teakWoodHex
      });
      this.detailsContainer.add(ingText);
    });

    // SECTION: Preparation Stages (Visual 4-Stage Workflow Cards)
    const prepTitleY = 222;
    const prepTitle = scene.add.text(0, prepTitleY, 'TAWA PREPARATION STAGES', {
      fontFamily: THEME.fonts.title,
      fontSize: '14px',
      color: THEME.colors.terracottaHex
    });
    this.detailsContainer.add(prepTitle);

    const cardW = 175;
    const cardH = 150;
    const cardGap = 10;
    const stagesY = prepTitleY + 24;

    r.prepStages.forEach((stage, idx) => {
      const cx = idx * (cardW + cardGap);
      const cardG = scene.add.graphics();

      // Card Background
      cardG.fillStyle(0xF2E6D0, 0.9);
      cardG.fillRoundedRect(cx, stagesY, cardW, cardH, 8);
      cardG.lineStyle(1.5, THEME.colors.brass, 0.5);
      cardG.strokeRoundedRect(cx, stagesY, cardW, cardH, 8);
      this.detailsContainer.add(cardG);

      // Stage Header Badge
      const stageBadge = scene.add.text(cx + 8, stagesY + 8, `STAGE ${stage.stageNumber}`, {
        fontFamily: THEME.fonts.body,
        fontSize: '10px',
        fontStyle: 'bold',
        color: THEME.colors.terracottaHex
      });
      this.detailsContainer.add(stageBadge);

      // Icon & Stage Title
      const sTitle = scene.add.text(cx + 8, stagesY + 24, `${stage.icon} ${stage.title}`, {
        fontFamily: THEME.fonts.title,
        fontSize: '11px',
        color: THEME.colors.teakWoodHex,
        wordWrap: { width: cardW - 16 }
      });
      this.detailsContainer.add(sTitle);

      // Detail
      const sDetail = scene.add.text(cx + 8, stagesY + 48, stage.detail, {
        fontFamily: THEME.fonts.body,
        fontSize: '10px',
        color: '#3A271B',
        wordWrap: { width: cardW - 16 },
        lineSpacing: 2
      });
      this.detailsContainer.add(sDetail);

      // Pro Tip
      const sTip = scene.add.text(cx + 8, stagesY + cardH - 32, `💡 Tip: ${stage.proTip}`, {
        fontFamily: THEME.fonts.body,
        fontSize: '9.5px',
        fontStyle: 'italic',
        color: THEME.colors.curryGreenHex,
        wordWrap: { width: cardW - 16 }
      });
      this.detailsContainer.add(sTip);
    });

    // SECTION: Cultural Heritage & Lore (Bottom banner)
    const loreY = 415;
    const loreG = scene.add.graphics();
    loreG.fillStyle(THEME.colors.curryGreen, 0.08);
    loreG.fillRoundedRect(0, loreY, 730, 48, 8);
    loreG.lineStyle(1.5, THEME.colors.curryGreen, 0.35);
    loreG.strokeRoundedRect(0, loreY, 730, 48, 8);
    this.detailsContainer.add(loreG);

    const loreTitle = scene.add.text(10, loreY + 6, 'SOUTH INDIAN CULINARY HERITAGE', {
      fontFamily: THEME.fonts.title,
      fontSize: '10.5px',
      color: THEME.colors.curryGreenHex
    });
    this.detailsContainer.add(loreTitle);

    const loreText = scene.add.text(10, loreY + 24, r.lore, {
      fontFamily: THEME.fonts.body,
      fontSize: '10px',
      color: '#26442C',
      fontStyle: 'italic',
      wordWrap: { width: 710 }
    });
    this.detailsContainer.add(loreText);
  }

  private closeModal(onClose: () => void): void {
    this.scene.tweens.add({
      targets: this.panel,
      scaleX: 0.85,
      scaleY: 0.85,
      alpha: 0,
      duration: 180,
      ease: 'Quad.easeIn',
      onComplete: () => {
        this.destroy();
        onClose();
      }
    });
  }
}
