import Phaser from 'phaser';
import { RealisticKitchenAssets } from './RealisticKitchenAssets';

/**
 * DOSA HOUSE - Procedural Canvas Asset Generator
 * Creates crisp South Indian themed UI elements, buttons, textures, and icons
 * dynamically into Phaser's TextureManager.
 */
export class AssetGenerator {
  public static generateAll(scene: Phaser.Scene): void {
    AssetGenerator.createWoodButtonTextures(scene);
    AssetGenerator.createSteamParticleTexture(scene);
    AssetGenerator.createKolamPatternTexture(scene);
    AssetGenerator.createBrassBadgeTexture(scene);
    AssetGenerator.createIcons(scene);
    AssetGenerator.createVignetteOverlay(scene);
    RealisticKitchenAssets.generateAll(scene);
    AssetGenerator.createRealisticDosaPhotos(scene);
    AssetGenerator.createCustomerAvatars(scene);
    AssetGenerator.createProgressionIcons(scene);
  }

  /**
   * Generates rich carved wooden buttons with brass borders and rivets
   */
  private static createWoodButtonTextures(scene: Phaser.Scene): void {
    const width = 340;
    const height = 72;
    const radius = 18;

    // Normal State
    const canvasNormal = document.createElement('canvas');
    canvasNormal.width = width;
    canvasNormal.height = height;
    const ctxNormal = canvasNormal.getContext('2d')!;

    // Drop shadow
    ctxNormal.shadowColor = 'rgba(10, 5, 2, 0.6)';
    ctxNormal.shadowBlur = 12;
    ctxNormal.shadowOffsetY = 6;

    // Wood body gradient (Teak to Rosewood)
    const woodGrad = ctxNormal.createLinearGradient(0, 0, 0, height);
    woodGrad.addColorStop(0, '#5C341C');
    woodGrad.addColorStop(0.3, '#432311');
    woodGrad.addColorStop(0.7, '#32190B');
    woodGrad.addColorStop(1, '#221006');

    ctxNormal.fillStyle = woodGrad;
    AssetGenerator.drawRoundedRect(ctxNormal, 6, 4, width - 12, height - 10, radius);
    ctxNormal.fill();

    // Reset shadow for inner details
    ctxNormal.shadowColor = 'transparent';

    // Wood grain lines
    ctxNormal.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctxNormal.lineWidth = 1;
    for (let y = 14; y < height - 14; y += 8) {
      ctxNormal.beginPath();
      ctxNormal.moveTo(14, y);
      ctxNormal.bezierCurveTo(width * 0.3, y - 2, width * 0.7, y + 2, width - 14, y);
      ctxNormal.stroke();
    }

    // Outer Brass Border
    const brassGrad = ctxNormal.createLinearGradient(0, 0, width, height);
    brassGrad.addColorStop(0, '#E8C55E');
    brassGrad.addColorStop(0.3, '#B8860B');
    brassGrad.addColorStop(0.7, '#F5DE88');
    brassGrad.addColorStop(1, '#8B6508');

    ctxNormal.strokeStyle = brassGrad;
    ctxNormal.lineWidth = 3.5;
    AssetGenerator.drawRoundedRect(ctxNormal, 8, 6, width - 16, height - 14, radius - 2);
    ctxNormal.stroke();

    // Inner subtle gold inset
    ctxNormal.strokeStyle = 'rgba(243, 167, 18, 0.4)';
    ctxNormal.lineWidth = 1;
    AssetGenerator.drawRoundedRect(ctxNormal, 12, 10, width - 24, height - 22, radius - 6);
    ctxNormal.stroke();

    // Corner Brass Rivets
    const rivets = [
      { x: 18, y: 16 },
      { x: width - 18, y: 16 },
      { x: 18, y: height - 18 },
      { x: width - 18, y: height - 18 }
    ];

    rivets.forEach(r => {
      ctxNormal.fillStyle = '#FFD700';
      ctxNormal.beginPath();
      ctxNormal.arc(r.x, r.y, 3, 0, Math.PI * 2);
      ctxNormal.fill();
      ctxNormal.fillStyle = '#654321';
      ctxNormal.beginPath();
      ctxNormal.arc(r.x + 0.5, r.y + 0.5, 1, 0, Math.PI * 2);
      ctxNormal.fill();
    });

    scene.textures.addCanvas('ui_wood_button', canvasNormal);

    // Hover State
    const canvasHover = document.createElement('canvas');
    canvasHover.width = width;
    canvasHover.height = height;
    const ctxHover = canvasHover.getContext('2d')!;

    // Golden glow shadow
    ctxHover.shadowColor = 'rgba(243, 167, 18, 0.7)';
    ctxHover.shadowBlur = 18;
    ctxHover.shadowOffsetY = 4;

    const woodGradHover = ctxHover.createLinearGradient(0, 0, 0, height);
    woodGradHover.addColorStop(0, '#734224');
    woodGradHover.addColorStop(0.3, '#572E16');
    woodGradHover.addColorStop(0.7, '#421E0C');
    woodGradHover.addColorStop(1, '#2E1507');

    ctxHover.fillStyle = woodGradHover;
    AssetGenerator.drawRoundedRect(ctxHover, 6, 4, width - 12, height - 10, radius);
    ctxHover.fill();

    ctxHover.shadowColor = 'transparent';

    // Highlighted Brass Border
    const brassGradHover = ctxHover.createLinearGradient(0, 0, width, height);
    brassGradHover.addColorStop(0, '#FFF2A8');
    brassGradHover.addColorStop(0.4, '#FFC72C');
    brassGradHover.addColorStop(0.8, '#FFE680');
    brassGradHover.addColorStop(1, '#D4AF37');

    ctxHover.strokeStyle = brassGradHover;
    ctxHover.lineWidth = 4;
    AssetGenerator.drawRoundedRect(ctxHover, 8, 6, width - 16, height - 14, radius - 2);
    ctxHover.stroke();

    // Rivets
    rivets.forEach(r => {
      ctxHover.fillStyle = '#FFF8D0';
      ctxHover.beginPath();
      ctxHover.arc(r.x, r.y, 3.5, 0, Math.PI * 2);
      ctxHover.fill();
    });

    scene.textures.addCanvas('ui_wood_button_hover', canvasHover);
  }

  /**
   * Generates a soft, smooth radial steam puff texture for particle emitter
   */
  private static createSteamParticleTexture(scene: Phaser.Scene): void {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
    grad.addColorStop(0.3, 'rgba(255, 250, 240, 0.35)');
    grad.addColorStop(0.7, 'rgba(253, 245, 230, 0.12)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    scene.textures.addCanvas('fx_steam', canvas);
  }

  /**
   * Generates traditional South Indian rice-flour Kolam / Rangoli mandala
   */
  private static createKolamPatternTexture(scene: Phaser.Scene): void {
    const size = 180;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const cx = size / 2;
    const cy = size / 2;

    ctx.strokeStyle = 'rgba(255, 248, 238, 0.55)';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';

    // Center lotus / flower petal loops
    const petals = 8;
    for (let i = 0; i < petals; i++) {
      const angle = (i * Math.PI * 2) / petals;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(25, -20, 50, -10, 65, 0);
      ctx.bezierCurveTo(50, 10, 25, 20, 0, 0);
      ctx.stroke();

      // Small accent dot
      ctx.fillStyle = 'rgba(243, 167, 18, 0.7)';
      ctx.beginPath();
      ctx.arc(45, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Concentric ring with dots
    ctx.strokeStyle = 'rgba(243, 167, 18, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 75, 0, Math.PI * 2);
    ctx.stroke();

    for (let j = 0; j < 16; j++) {
      const a = (j * Math.PI * 2) / 16;
      ctx.fillStyle = 'rgba(255, 248, 238, 0.8)';
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * 75, cy + Math.sin(a) * 75, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    scene.textures.addCanvas('ui_kolam', canvas);
  }

  /**
   * Generates a traditional embossed brass medallion / badge
   */
  private static createBrassBadgeTexture(scene: Phaser.Scene): void {
    const size = 96;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const cx = size / 2;
    const cy = size / 2;

    // Drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    const grad = ctx.createRadialGradient(cx - 10, cy - 10, 5, cx, cy, 45);
    grad.addColorStop(0, '#FFE899');
    grad.addColorStop(0.4, '#D4AF37');
    grad.addColorStop(0.8, '#99751D');
    grad.addColorStop(1, '#5C440E');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 42, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = 'transparent';

    // Concentric beaded ring
    ctx.strokeStyle = '#FFE899';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 36, 0, Math.PI * 2);
    ctx.stroke();

    // Rivet beads
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      const bx = cx + Math.cos(angle) * 36;
      const by = cy + Math.sin(angle) * 36;
      ctx.fillStyle = '#FFF5CC';
      ctx.beginPath();
      ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    scene.textures.addCanvas('ui_brass_badge', canvas);
  }

  /**
   * Generates stylized UI icons: Play (Tawa Spatula), Book (Palm Leaf / Recipe), Settings (Brass Gear), Sound
   */
  private static createIcons(scene: Phaser.Scene): void {
    // 1. Play Icon (Hot Dosa Tawa & Spatula silhouette)
    const playCanvas = document.createElement('canvas');
    playCanvas.width = 48;
    playCanvas.height = 48;
    const pctx = playCanvas.getContext('2d')!;

    pctx.fillStyle = '#F3A712';
    pctx.beginPath();
    pctx.arc(22, 24, 16, 0, Math.PI * 2);
    pctx.fill();

    pctx.fillStyle = '#3D2314';
    pctx.beginPath();
    pctx.arc(22, 24, 13, 0, Math.PI * 2);
    pctx.fill();

    // Spatula handle
    pctx.fillStyle = '#D4AF37';
    pctx.fillRect(32, 20, 14, 5);
    pctx.beginPath();
    pctx.arc(46, 22.5, 3, 0, Math.PI * 2);
    pctx.fill();

    scene.textures.addCanvas('icon_play', playCanvas);

    // 2. Recipe Book Icon
    const bookCanvas = document.createElement('canvas');
    bookCanvas.width = 48;
    bookCanvas.height = 48;
    const bctx = bookCanvas.getContext('2d')!;

    bctx.fillStyle = '#D4AF37';
    bctx.beginPath();
    AssetGenerator.drawRoundedRect(bctx, 8, 8, 32, 32, 6);
    bctx.fill();

    bctx.fillStyle = '#FFF8EE';
    AssetGenerator.drawRoundedRect(bctx, 12, 12, 24, 24, 4);
    bctx.fill();

    // Page text lines
    bctx.fillStyle = '#C15C3D';
    bctx.fillRect(16, 17, 16, 2.5);
    bctx.fillRect(16, 23, 13, 2.5);
    bctx.fillRect(16, 29, 15, 2.5);

    scene.textures.addCanvas('icon_recipe_book', bookCanvas);

    // 3. Settings Icon (Brass Gear)
    const gearCanvas = document.createElement('canvas');
    gearCanvas.width = 48;
    gearCanvas.height = 48;
    const gctx = gearCanvas.getContext('2d')!;

    gctx.fillStyle = '#D4AF37';
    const cx = 24;
    const cy = 24;
    const teeth = 8;
    gctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a = (i * Math.PI * 2) / teeth;
      const x1 = cx + Math.cos(a) * 18;
      const y1 = cy + Math.sin(a) * 18;
      gctx.arc(x1, y1, 4, 0, Math.PI * 2);
    }
    gctx.arc(cx, cy, 14, 0, Math.PI * 2);
    gctx.fill();

    gctx.fillStyle = '#3D2314';
    gctx.beginPath();
    gctx.arc(cx, cy, 6, 0, Math.PI * 2);
    gctx.fill();

    scene.textures.addCanvas('icon_settings', gearCanvas);

    // 4. Sound On Icon
    const soundCanvas = document.createElement('canvas');
    soundCanvas.width = 44;
    soundCanvas.height = 44;
    const sctx = soundCanvas.getContext('2d')!;

    sctx.fillStyle = '#FFF8EE';
    // Speaker base
    sctx.beginPath();
    sctx.moveTo(10, 16);
    sctx.lineTo(17, 16);
    sctx.lineTo(26, 9);
    sctx.lineTo(26, 35);
    sctx.lineTo(17, 28);
    sctx.lineTo(10, 28);
    sctx.closePath();
    sctx.fill();

    // Sound waves
    sctx.strokeStyle = '#F3A712';
    sctx.lineWidth = 2.5;
    sctx.lineCap = 'round';
    sctx.beginPath();
    sctx.arc(26, 22, 8, -Math.PI / 3, Math.PI / 3);
    sctx.stroke();

    sctx.beginPath();
    sctx.arc(26, 22, 14, -Math.PI / 3, Math.PI / 3);
    sctx.stroke();

    scene.textures.addCanvas('icon_sound_on', soundCanvas);

    // 5. Sound Off Icon
    const soundOffCanvas = document.createElement('canvas');
    soundOffCanvas.width = 44;
    soundOffCanvas.height = 44;
    const soctx = soundOffCanvas.getContext('2d')!;

    soctx.fillStyle = '#FFF8EE';
    soctx.beginPath();
    soctx.moveTo(10, 16);
    soctx.lineTo(17, 16);
    soctx.lineTo(26, 9);
    soctx.lineTo(26, 35);
    soctx.lineTo(17, 28);
    soctx.lineTo(10, 28);
    soctx.closePath();
    soctx.fill();

    // Red mute slash
    soctx.strokeStyle = '#C15C3D';
    soctx.lineWidth = 3.5;
    soctx.lineCap = 'round';
    soctx.beginPath();
    soctx.moveTo(8, 8);
    soctx.lineTo(36, 36);
    soctx.stroke();

    scene.textures.addCanvas('icon_sound_off', soundOffCanvas);

    // 6. Close Modal Icon
    const closeCanvas = document.createElement('canvas');
    closeCanvas.width = 40;
    closeCanvas.height = 40;
    const cctx = closeCanvas.getContext('2d')!;

    cctx.fillStyle = '#C15C3D';
    cctx.beginPath();
    cctx.arc(20, 20, 18, 0, Math.PI * 2);
    cctx.fill();

    cctx.strokeStyle = '#D4AF37';
    cctx.lineWidth = 2;
    cctx.beginPath();
    cctx.arc(20, 20, 17, 0, Math.PI * 2);
    cctx.stroke();

    cctx.strokeStyle = '#FFF8EE';
    cctx.lineWidth = 3.5;
    cctx.lineCap = 'round';
    cctx.beginPath();
    cctx.moveTo(13, 13);
    cctx.lineTo(27, 27);
    cctx.moveTo(27, 13);
    cctx.lineTo(13, 27);
    cctx.stroke();

    scene.textures.addCanvas('icon_close', closeCanvas);
  }

  /**
   * Generates cozy dark vignette overlay to focus eye on the center of the screen
   */
  private static createVignetteOverlay(scene: Phaser.Scene): void {
    const width = 1280;
    const height = 720;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(
      width / 2, height / 2, 250,
      width / 2, height / 2, 700
    );
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.7, 'rgba(26, 14, 7, 0.45)');
    grad.addColorStop(1, 'rgba(15, 7, 3, 0.85)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    scene.textures.addCanvas('fx_vignette', canvas);
  }

  private static drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  /**
   * Generates realistic food photograph cards for dishes that don't have static photographic files
   */
  private static createRealisticDosaPhotos(scene: Phaser.Scene): void {
    // 1. Onion Uthappam Photo Card (400x300)
    const uCanvas = document.createElement('canvas');
    uCanvas.width = 400;
    uCanvas.height = 300;
    const uctx = uCanvas.getContext('2d')!;

    // Warm rustic wooden background
    const uWood = uctx.createLinearGradient(0, 0, 400, 300);
    uWood.addColorStop(0, '#3E2413');
    uWood.addColorStop(1, '#221208');
    uctx.fillStyle = uWood;
    uctx.fillRect(0, 0, 400, 300);

    // Banana Leaf
    uctx.save();
    uctx.translate(200, 155);
    uctx.fillStyle = '#1E8449';
    uctx.beginPath();
    uctx.ellipse(0, 0, 185, 120, -0.05, 0, Math.PI * 2);
    uctx.fill();

    // Leaf vein
    uctx.strokeStyle = '#52BE80';
    uctx.lineWidth = 2.5;
    uctx.beginPath();
    uctx.moveTo(-180, 0);
    uctx.lineTo(180, 0);
    uctx.stroke();

    // Thick fluffy uthappam disc
    const uthGrad = uctx.createRadialGradient(-20, -10, 15, 0, 0, 95);
    uthGrad.addColorStop(0, '#FAD7A0');
    uthGrad.addColorStop(0.6, '#F5B041');
    uthGrad.addColorStop(0.9, '#D68910');
    uthGrad.addColorStop(1, '#B9770E');

    uctx.fillStyle = uthGrad;
    uctx.beginPath();
    uctx.ellipse(-25, 0, 95, 78, 0, 0, Math.PI * 2);
    uctx.fill();

    // Caramelized shallots & chillies embedded
    for (let i = 0; i < 28; i++) {
      const a = (i * Math.PI * 2) / 28;
      const d = 12 + (i % 4) * 18;
      const ox = -25 + Math.cos(a) * d;
      const oy = Math.sin(a) * (d * 0.8);

      uctx.fillStyle = '#8E44AD';
      uctx.beginPath();
      uctx.ellipse(ox, oy, 7, 4.5, i * 0.3, 0, Math.PI * 2);
      uctx.fill();

      uctx.fillStyle = '#F4ECF7';
      uctx.beginPath();
      uctx.ellipse(ox, oy, 4, 2.5, i * 0.3, 0, Math.PI * 2);
      uctx.fill();

      // Caramelized brown edges
      uctx.strokeStyle = '#6E2C00';
      uctx.lineWidth = 1;
      uctx.stroke();
    }

    // Green chilli bits & cilantro
    for (let j = 0; j < 12; j++) {
      const a = (j * Math.PI * 2) / 12 + 0.4;
      const d = 15 + (j % 3) * 20;
      uctx.fillStyle = '#27AE60';
      uctx.beginPath();
      uctx.arc(-25 + Math.cos(a) * d, Math.sin(a) * (d * 0.8), 3.5, 0, Math.PI * 2);
      uctx.fill();
    }

    // Steel bowls of chutney on the right
    // Coconut Chutney
    uctx.fillStyle = '#BDC3C7';
    uctx.beginPath();
    uctx.arc(120, -35, 34, 0, Math.PI * 2);
    uctx.fill();
    uctx.fillStyle = '#FAFAF5';
    uctx.beginPath();
    uctx.arc(120, -35, 29, 0, Math.PI * 2);
    uctx.fill();
    uctx.fillStyle = '#111';
    uctx.beginPath();
    uctx.arc(116, -37, 1.5, 0, Math.PI * 2);
    uctx.arc(124, -33, 1.5, 0, Math.PI * 2);
    uctx.fill();
    uctx.fillStyle = '#27AE60';
    uctx.beginPath();
    uctx.ellipse(120, -35, 6, 3, 0.4, 0, Math.PI * 2);
    uctx.fill();

    // Tomato Chutney
    uctx.fillStyle = '#BDC3C7';
    uctx.beginPath();
    uctx.arc(120, 42, 34, 0, Math.PI * 2);
    uctx.fill();
    uctx.fillStyle = '#C0392B';
    uctx.beginPath();
    uctx.arc(120, 42, 29, 0, Math.PI * 2);
    uctx.fill();

    uctx.restore();

    scene.textures.addCanvas('photo_onion_uthappam', uCanvas);

    // 2. Mysore Royal Masala Dosa Photo Card (400x300)
    const mCanvas = document.createElement('canvas');
    mCanvas.width = 400;
    mCanvas.height = 300;
    const mctx = mCanvas.getContext('2d')!;

    // Warm table
    mctx.fillStyle = uWood;
    mctx.fillRect(0, 0, 400, 300);

    // Banana leaf
    mctx.save();
    mctx.translate(200, 150);
    mctx.fillStyle = '#196F3D';
    mctx.beginPath();
    mctx.ellipse(0, 0, 185, 125, 0, 0, Math.PI * 2);
    mctx.fill();

    // Crisp Golden Folded Mysore Dosa (Triangle with red chutney inside)
    mctx.fillStyle = '#B9770E';
    mctx.beginPath();
    mctx.moveTo(-140, 50);
    mctx.lineTo(20, -85);
    mctx.lineTo(80, 60);
    mctx.closePath();
    mctx.fill();

    const mDosaGrad = mctx.createLinearGradient(-140, 50, 80, 60);
    mDosaGrad.addColorStop(0, '#F5B041');
    mDosaGrad.addColorStop(0.5, '#E59866');
    mDosaGrad.addColorStop(1, '#D35400');
    mctx.fillStyle = mDosaGrad;
    mctx.fill();

    // Red Mysore Chutney Smear visible in fold
    mctx.fillStyle = '#C0392B';
    mctx.beginPath();
    mctx.moveTo(-80, 20);
    mctx.lineTo(10, -50);
    mctx.lineTo(30, 25);
    mctx.closePath();
    mctx.fill();

    // Potato masala peak
    mctx.fillStyle = '#F4D03F';
    mctx.beginPath();
    mctx.arc(-20, 0, 18, 0, Math.PI * 2);
    mctx.fill();

    // Dollop of white butter (Makhan)
    mctx.fillStyle = '#FFFFFF';
    mctx.beginPath();
    mctx.arc(-15, -4, 9, 0, Math.PI * 2);
    mctx.fill();

    // Steel bowls on right
    mctx.fillStyle = '#BDC3C7';
    mctx.beginPath();
    mctx.arc(130, -30, 32, 0, Math.PI * 2);
    mctx.arc(130, 45, 32, 0, Math.PI * 2);
    mctx.fill();

    // White chutney & sambar
    mctx.fillStyle = '#FAFAF5';
    mctx.beginPath();
    mctx.arc(130, -30, 27, 0, Math.PI * 2);
    mctx.fill();

    mctx.fillStyle = '#D35400';
    mctx.beginPath();
    mctx.arc(130, 45, 27, 0, Math.PI * 2);
    mctx.fill();

    mctx.restore();

    scene.textures.addCanvas('photo_mysore_masala', mCanvas);

    // 3. Giant Paper Ghee Roast Photo Card (400x300)
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 400;
    pCanvas.height = 300;
    const pctx = pCanvas.getContext('2d')!;
    pctx.fillStyle = uWood;
    pctx.fillRect(0, 0, 400, 300);

    // Two banana leaves overlapping
    pctx.save();
    pctx.translate(200, 150);
    pctx.fillStyle = '#1E8449';
    pctx.beginPath();
    pctx.ellipse(-50, 10, 150, 95, -0.1, 0, Math.PI * 2);
    pctx.ellipse(60, 5, 140, 90, 0.1, 0, Math.PI * 2);
    pctx.fill();

    // Leaf veins
    pctx.strokeStyle = '#52BE80';
    pctx.lineWidth = 2;
    pctx.beginPath();
    pctx.moveTo(-180, 10);
    pctx.lineTo(180, 5);
    pctx.stroke();

    // Giant 3-foot rolled flute cylinder
    const fluteGrad = pctx.createLinearGradient(-170, -25, 170, 25);
    fluteGrad.addColorStop(0, '#F5B041');
    fluteGrad.addColorStop(0.3, '#FAD7A0');
    fluteGrad.addColorStop(0.6, '#E59866');
    fluteGrad.addColorStop(1, '#D35400');

    pctx.fillStyle = fluteGrad;
    pctx.beginPath();
    pctx.roundRect(-165, -28, 330, 56, 18);
    pctx.fill();

    // Crispy golden roast ridges
    pctx.strokeStyle = '#935116';
    pctx.lineWidth = 2.5;
    pctx.beginPath();
    pctx.moveTo(-150, -14);
    pctx.lineTo(150, -14);
    pctx.moveTo(-155, 0);
    pctx.lineTo(155, 0);
    pctx.moveTo(-150, 14);
    pctx.lineTo(150, 14);
    pctx.stroke();

    // Glistening golden ghee streak along top
    pctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    pctx.fillRect(-140, -22, 280, 7);

    // Rolled spiral ends
    pctx.fillStyle = '#784212';
    pctx.beginPath();
    pctx.ellipse(-162, 0, 6, 22, 0, 0, Math.PI * 2);
    pctx.ellipse(162, 0, 6, 22, 0, 0, Math.PI * 2);
    pctx.fill();

    // Steel bowls (chutney & sambar)
    pctx.fillStyle = '#BDC3C7';
    pctx.beginPath();
    pctx.arc(-80, 80, 24, 0, Math.PI * 2);
    pctx.arc(0, 80, 24, 0, Math.PI * 2);
    pctx.arc(80, 80, 24, 0, Math.PI * 2);
    pctx.fill();

    // White coconut, red tomato, sambar
    pctx.fillStyle = '#FAFAF5';
    pctx.beginPath();
    pctx.arc(-80, 80, 20, 0, Math.PI * 2);
    pctx.fill();

    pctx.fillStyle = '#C0392B';
    pctx.beginPath();
    pctx.arc(0, 80, 20, 0, Math.PI * 2);
    pctx.fill();

    pctx.fillStyle = '#D35400';
    pctx.beginPath();
    pctx.arc(80, 80, 20, 0, Math.PI * 2);
    pctx.fill();

    pctx.restore();
    scene.textures.addCanvas('photo_paper_roast', pCanvas);

    // 4. Chettinad Spicy Paneer Dosa Photo Card (400x300)
    const cCanvas = document.createElement('canvas');
    cCanvas.width = 400;
    cCanvas.height = 300;
    const cctx = cCanvas.getContext('2d')!;
    cctx.fillStyle = uWood;
    cctx.fillRect(0, 0, 400, 300);

    cctx.save();
    cctx.translate(200, 150);
    cctx.fillStyle = '#196F3D';
    cctx.beginPath();
    cctx.ellipse(0, 0, 185, 125, 0, 0, Math.PI * 2);
    cctx.fill();

    // Triangle Envelope Dosa
    cctx.fillStyle = '#D68910';
    cctx.beginPath();
    cctx.moveTo(-130, 55);
    cctx.lineTo(15, -80);
    cctx.lineTo(85, 55);
    cctx.closePath();
    cctx.fill();

    // Pepper roast sheen
    const cGrad = cctx.createLinearGradient(-130, 55, 85, 55);
    cGrad.addColorStop(0, '#F5B041');
    cGrad.addColorStop(0.5, '#E59866');
    cGrad.addColorStop(1, '#BA4A00');
    cctx.fillStyle = cGrad;
    cctx.fill();

    // Spicy paneer cubes spilling from center
    const paneerCubes = [
      { x: -35, y: -5, w: 18, h: 14 },
      { x: -10, y: 12, w: 20, h: 15 },
      { x: 15, y: -2, w: 17, h: 13 },
      { x: -20, y: 25, w: 16, h: 14 }
    ];
    paneerCubes.forEach(pc => {
      cctx.fillStyle = '#FEF9E7';
      cctx.fillRect(pc.x, pc.y, pc.w, pc.h);
      cctx.strokeStyle = '#935116';
      cctx.strokeRect(pc.x, pc.y, pc.w, pc.h);
    });

    // Cracked black peppercorns & fennel specks
    cctx.fillStyle = '#17202A';
    for (let k = 0; k < 18; k++) {
      cctx.beginPath();
      cctx.arc(-40 + (k * 6), 5 + (k % 4) * 8, 2, 0, Math.PI * 2);
      cctx.fill();
    }

    // Fresh coriander sprig
    cctx.fillStyle = '#27AE60';
    cctx.beginPath();
    cctx.ellipse(-5, 0, 10, 5, 0.4, 0, Math.PI * 2);
    cctx.fill();

    // Chutney bowl on side
    cctx.fillStyle = '#BDC3C7';
    cctx.beginPath();
    cctx.arc(130, 0, 30, 0, Math.PI * 2);
    cctx.fill();
    cctx.fillStyle = '#27AE60'; // Mint chutney
    cctx.beginPath();
    cctx.arc(130, 0, 25, 0, Math.PI * 2);
    cctx.fill();

    cctx.restore();
    scene.textures.addCanvas('photo_chettinad_paneer', cCanvas);

    // 5. Amul Cheese & Green Chilli Dosa Photo Card (400x300)
    const chCanvas = document.createElement('canvas');
    chCanvas.width = 400;
    chCanvas.height = 300;
    const chctx = chCanvas.getContext('2d')!;
    chctx.fillStyle = uWood;
    chctx.fillRect(0, 0, 400, 300);

    chctx.save();
    chctx.translate(200, 150);
    chctx.fillStyle = '#1E8449';
    chctx.beginPath();
    chctx.ellipse(0, 0, 185, 125, 0, 0, Math.PI * 2);
    chctx.fill();

    // Half Moon Golden Dosa
    chctx.fillStyle = '#F39C12';
    chctx.beginPath();
    chctx.arc(-20, 20, 105, Math.PI, 0, false);
    chctx.closePath();
    chctx.fill();

    const chGrad = chctx.createRadialGradient(-20, 15, 20, -20, 15, 100);
    chGrad.addColorStop(0, '#FAD7A0');
    chGrad.addColorStop(0.5, '#F5B041');
    chGrad.addColorStop(1, '#D35400');
    chctx.fillStyle = chGrad;
    chctx.fill();

    // Molten white/golden melted cheese strings pulling from the seam
    chctx.strokeStyle = '#FEF9E7';
    chctx.lineWidth = 6;
    chctx.lineCap = 'round';
    chctx.beginPath();
    chctx.moveTo(-110, 22);
    chctx.quadraticCurveTo(-60, 45, 0, 22);
    chctx.quadraticCurveTo(45, 48, 80, 22);
    chctx.stroke();

    chctx.strokeStyle = '#F9E79F';
    chctx.lineWidth = 4;
    chctx.beginPath();
    chctx.moveTo(-90, 24);
    chctx.quadraticCurveTo(-40, 52, 20, 24);
    chctx.stroke();

    // Sliced spicy green chilli rounds
    for (let g = 0; g < 9; g++) {
      const gx = -80 + g * 18;
      const gy = 18 + (g % 3) * 6;
      chctx.fillStyle = '#27AE60';
      chctx.beginPath();
      chctx.arc(gx, gy, 4.5, 0, Math.PI * 2);
      chctx.fill();
      chctx.fillStyle = '#FFFFFF';
      chctx.beginPath();
      chctx.arc(gx, gy, 1.8, 0, Math.PI * 2);
      chctx.fill();
    }

    // Tomato Thokku bowl on side
    chctx.fillStyle = '#BDC3C7';
    chctx.beginPath();
    chctx.arc(130, 20, 30, 0, Math.PI * 2);
    chctx.fill();
    chctx.fillStyle = '#900C3F';
    chctx.beginPath();
    chctx.arc(130, 20, 25, 0, Math.PI * 2);
    chctx.fill();

    chctx.restore();
    scene.textures.addCanvas('photo_cheese_chilli', chCanvas);

    // 6. Lacy Rava Cumin Roast Photo Card (400x300)
    const rCanvas = document.createElement('canvas');
    rCanvas.width = 400;
    rCanvas.height = 300;
    const rctx = rCanvas.getContext('2d')!;
    rctx.fillStyle = uWood;
    rctx.fillRect(0, 0, 400, 300);

    rctx.save();
    rctx.translate(200, 150);
    rctx.fillStyle = '#145A32';
    rctx.beginPath();
    rctx.ellipse(0, 0, 185, 125, 0, 0, Math.PI * 2);
    rctx.fill();

    // Wafer-thin net honeycomb semolina mesh
    rctx.fillStyle = '#FAD7A0';
    rctx.beginPath();
    rctx.ellipse(-25, 0, 110, 85, 0, 0, Math.PI * 2);
    rctx.fill();

    // Hundreds of lacy honeycomb holes!
    rctx.fillStyle = '#145A32';
    for (let h = 0; h < 46; h++) {
      const ha = (h * 2.39996) % (Math.PI * 2);
      const hd = Math.sqrt((h + 1) / 46) * 78;
      const hx = -25 + Math.cos(ha) * hd;
      const hy = Math.sin(ha) * (hd * 0.75);
      rctx.beginPath();
      rctx.arc(hx, hy, 2 + (h % 3) * 1.5, 0, Math.PI * 2);
      rctx.fill();
    }

    // Crunchy whole black peppercorns & cumin seeds
    rctx.fillStyle = '#17202A';
    for (let c = 0; c < 24; c++) {
      const ca = (c * 1.7) % (Math.PI * 2);
      const cd = 10 + (c * 3) % 75;
      rctx.beginPath();
      rctx.arc(-25 + Math.cos(ca) * cd, Math.sin(ca) * (cd * 0.7), 2.2, 0, Math.PI * 2);
      rctx.fill();
    }
    rctx.fillStyle = '#784212';
    for (let c = 0; c < 18; c++) {
      const ca = (c * 2.1) % (Math.PI * 2);
      const cd = 15 + (c * 3.5) % 70;
      rctx.fillRect(-27 + Math.cos(ca) * cd, Math.sin(ca) * (cd * 0.7), 4, 1.5);
    }

    // Crispy golden outer rim
    rctx.strokeStyle = '#B9770E';
    rctx.lineWidth = 3;
    rctx.beginPath();
    rctx.ellipse(-25, 0, 110, 85, 0, 0, Math.PI * 2);
    rctx.stroke();

    // Trio of chutneys on right
    rctx.fillStyle = '#BDC3C7';
    rctx.beginPath();
    rctx.arc(125, -35, 26, 0, Math.PI * 2);
    rctx.arc(125, 35, 26, 0, Math.PI * 2);
    rctx.fill();
    rctx.fillStyle = '#FAFAF5';
    rctx.beginPath();
    rctx.arc(125, -35, 22, 0, Math.PI * 2);
    rctx.fill();
    rctx.fillStyle = '#E67E22';
    rctx.beginPath();
    rctx.arc(125, 35, 22, 0, Math.PI * 2);
    rctx.fill();

    rctx.restore();
    scene.textures.addCanvas('photo_rava_crispy', rCanvas);

    // 7. Sweet Jaggery Coconut Dosa Photo Card (400x300)
    const jCanvas = document.createElement('canvas');
    jCanvas.width = 400;
    jCanvas.height = 300;
    const jctx = jCanvas.getContext('2d')!;
    jctx.fillStyle = uWood;
    jctx.fillRect(0, 0, 400, 300);

    jctx.save();
    jctx.translate(200, 150);
    jctx.fillStyle = '#196F3D';
    jctx.beginPath();
    jctx.ellipse(0, 0, 185, 125, 0, 0, Math.PI * 2);
    jctx.fill();

    // Dark caramelized palm jaggery crescent
    const jGrad = jctx.createRadialGradient(-20, 15, 15, -20, 15, 95);
    jGrad.addColorStop(0, '#E59866');
    jGrad.addColorStop(0.5, '#BA4A00');
    jGrad.addColorStop(0.85, '#78281F');
    jGrad.addColorStop(1, '#4A235A');

    jctx.fillStyle = jGrad;
    jctx.beginPath();
    jctx.arc(-20, 20, 100, Math.PI, 0, false);
    jctx.closePath();
    jctx.fill();

    // Snowfall of freshly grated tender coconut flakes
    jctx.fillStyle = '#FFFFFF';
    for (let f = 0; f < 36; f++) {
      const fa = Math.PI + (f / 36) * Math.PI;
      const fd = 25 + (f % 5) * 14;
      const fx = -20 + Math.cos(fa) * fd;
      const fy = 20 - Math.sin(fa) * (fd * 0.75);
      jctx.beginPath();
      jctx.ellipse(fx, fy, 4, 1.8, f * 0.4, 0, Math.PI * 2);
      jctx.fill();
    }

    // Crushed green cardamom specks
    jctx.fillStyle = '#27AE60';
    for (let cd = 0; cd < 14; cd++) {
      const cda = Math.PI + (cd / 14) * Math.PI;
      const cdd = 30 + (cd % 4) * 12;
      jctx.beginPath();
      jctx.arc(-20 + Math.cos(cda) * cdd, 20 - Math.sin(cda) * (cdd * 0.75), 1.6, 0, Math.PI * 2);
      jctx.fill();
    }

    // Dollop of fresh churned white butter on top
    jctx.fillStyle = '#FFFDF5';
    jctx.beginPath();
    jctx.ellipse(-20, -10, 16, 10, -0.2, 0, Math.PI * 2);
    jctx.fill();

    // Brass filter coffee dabarah set on right
    jctx.fillStyle = '#F39C12';
    jctx.beginPath();
    jctx.arc(125, 15, 32, 0, Math.PI * 2);
    jctx.fill();
    jctx.fillStyle = '#D4AC0D';
    jctx.beginPath();
    jctx.arc(125, 15, 27, 0, Math.PI * 2);
    jctx.fill();
    // Frothy coffee center
    jctx.fillStyle = '#6E2C00';
    jctx.beginPath();
    jctx.arc(125, 15, 20, 0, Math.PI * 2);
    jctx.fill();
    jctx.fillStyle = '#FAD7A0'; // foam froth
    jctx.beginPath();
    jctx.arc(125, 15, 12, 0, Math.PI * 2);
    jctx.fill();

    jctx.restore();
    scene.textures.addCanvas('photo_jaggery_coconut', jCanvas);
  }

  /**
   * Generates expressive South Indian customer character avatar portraits
   */
  private static createCustomerAvatars(scene: Phaser.Scene): void {
    const size = 96;

    // 1. Uncle Venkatesh (Elderly, vibhuti, mustache, glasses, foodie smile)
    const vCanvas = document.createElement('canvas');
    vCanvas.width = size;
    vCanvas.height = size;
    const vctx = vCanvas.getContext('2d')!;
    AssetGenerator.drawAvatarCircleBase(vctx, size, '#E0D3BD', '#432616');

    // Kurta collar
    vctx.fillStyle = '#FFF8EE';
    vctx.beginPath();
    vctx.moveTo(28, 92);
    vctx.lineTo(48, 70);
    vctx.lineTo(68, 92);
    vctx.closePath();
    vctx.fill();

    // Head
    vctx.fillStyle = '#D69B67';
    vctx.beginPath();
    vctx.arc(48, 46, 26, 0, Math.PI * 2);
    vctx.fill();

    // Grey hair on sides and bald crown
    vctx.fillStyle = '#CCCCCC';
    vctx.beginPath();
    vctx.arc(48, 40, 27, Math.PI * 0.9, Math.PI * 2.1);
    vctx.stroke();

    // Sandalwood Vibhuti (3 white lines on forehead)
    vctx.strokeStyle = '#FFFFFF';
    vctx.lineWidth = 1.8;
    for (let l = 0; l < 3; l++) {
      vctx.beginPath();
      vctx.moveTo(38, 27 + l * 3.5);
      vctx.lineTo(58, 27 + l * 3.5);
      vctx.stroke();
    }
    // Red Kumkum bindi in center of vibhuti
    vctx.fillStyle = '#C0392B';
    vctx.beginPath();
    vctx.arc(48, 30.5, 2, 0, Math.PI * 2);
    vctx.fill();

    // Tortoiseshell Glasses
    vctx.strokeStyle = '#3E2413';
    vctx.lineWidth = 2.2;
    vctx.strokeRect(33, 40, 12, 10);
    vctx.strokeRect(51, 40, 12, 10);
    vctx.beginPath();
    vctx.moveTo(45, 45);
    vctx.lineTo(51, 45);
    vctx.stroke();

    // Happy eyes
    vctx.fillStyle = '#221105';
    vctx.beginPath();
    vctx.arc(39, 45, 2.5, 0, Math.PI * 2);
    vctx.arc(57, 45, 2.5, 0, Math.PI * 2);
    vctx.fill();

    // Grey-White curved mustache
    vctx.fillStyle = '#EEEEEE';
    vctx.beginPath();
    vctx.moveTo(35, 57);
    vctx.quadraticCurveTo(48, 52, 61, 57);
    vctx.quadraticCurveTo(48, 62, 35, 57);
    vctx.fill();

    // Gentle smile
    vctx.strokeStyle = '#994422';
    vctx.lineWidth = 1.8;
    vctx.beginPath();
    vctx.arc(48, 56, 7, 0.2, Math.PI - 0.2);
    vctx.stroke();

    scene.textures.addCanvas('avatar_venkatesh', vCanvas);

    // 2. Priya (Young woman, jasmine flowers, nose pin, cheerful smile)
    const pCanvas = document.createElement('canvas');
    pCanvas.width = size;
    pCanvas.height = size;
    const pctx = pCanvas.getContext('2d')!;
    AssetGenerator.drawAvatarCircleBase(pctx, size, '#FADBD8', '#C0392B');

    // Kurti collar
    pctx.fillStyle = '#F39C12';
    pctx.beginPath();
    pctx.moveTo(25, 92);
    pctx.lineTo(48, 68);
    pctx.lineTo(71, 92);
    pctx.closePath();
    pctx.fill();

    // Hair back bun & braid
    pctx.fillStyle = '#1C130D';
    pctx.beginPath();
    pctx.arc(48, 44, 28, 0, Math.PI * 2);
    pctx.fill();

    // Face
    pctx.fillStyle = '#C68755';
    pctx.beginPath();
    pctx.arc(48, 48, 23, 0, Math.PI * 2);
    pctx.fill();

    // Center-parted sleek dark hair
    pctx.fillStyle = '#1C130D';
    pctx.beginPath();
    pctx.moveTo(25, 45);
    pctx.quadraticCurveTo(48, 25, 48, 38);
    pctx.quadraticCurveTo(48, 25, 71, 45);
    pctx.lineTo(71, 30);
    pctx.lineTo(25, 30);
    pctx.closePath();
    pctx.fill();

    // Jasmine flowers (Malli Poo) tucked on the side
    pctx.fillStyle = '#FFFFFF';
    const flowerDots = [
      { x: 25, y: 36 }, { x: 22, y: 42 }, { x: 26, y: 48 }, { x: 22, y: 53 }
    ];
    flowerDots.forEach(f => {
      pctx.beginPath();
      pctx.arc(f.x, f.y, 4, 0, Math.PI * 2);
      pctx.fill();
    });

    // Small round red bindi
    pctx.fillStyle = '#C0392B';
    pctx.beginPath();
    pctx.arc(48, 39, 2.2, 0, Math.PI * 2);
    pctx.fill();

    // Expressive doe eyes
    pctx.fillStyle = '#1A0E07';
    pctx.beginPath();
    pctx.ellipse(39, 47, 3.5, 2.5, 0, 0, Math.PI * 2);
    pctx.ellipse(57, 47, 3.5, 2.5, 0, 0, Math.PI * 2);
    pctx.fill();

    // Gold nose pin sparkle
    pctx.fillStyle = '#FFD700';
    pctx.beginPath();
    pctx.arc(43, 53, 1.8, 0, Math.PI * 2);
    pctx.fill();

    // Warm cheerful smile
    pctx.strokeStyle = '#93281E';
    pctx.lineWidth = 2;
    pctx.beginPath();
    pctx.arc(48, 55, 6.5, 0.2, Math.PI - 0.2);
    pctx.stroke();

    scene.textures.addCanvas('avatar_priya', pCanvas);

    // 3. Karthik (Young foodie techie, hipster frames, enthusiastic smile)
    const kCanvas = document.createElement('canvas');
    kCanvas.width = size;
    kCanvas.height = size;
    const kctx = kCanvas.getContext('2d')!;
    AssetGenerator.drawAvatarCircleBase(kctx, size, '#D4EFDF', '#27AE60');

    // Maroon shirt collar
    kctx.fillStyle = '#78281F';
    kctx.beginPath();
    kctx.moveTo(26, 92);
    kctx.lineTo(48, 70);
    kctx.lineTo(70, 92);
    kctx.closePath();
    kctx.fill();

    // Face
    kctx.fillStyle = '#CD8E5B';
    kctx.beginPath();
    kctx.arc(48, 46, 24, 0, Math.PI * 2);
    kctx.fill();

    // Trendy modern hair
    kctx.fillStyle = '#21160F';
    kctx.beginPath();
    kctx.moveTo(25, 40);
    kctx.quadraticCurveTo(35, 18, 52, 22);
    kctx.quadraticCurveTo(68, 20, 71, 40);
    kctx.lineTo(71, 30);
    kctx.lineTo(25, 30);
    kctx.closePath();
    kctx.fill();

    // Black hipster rectangular glasses
    kctx.strokeStyle = '#111111';
    kctx.lineWidth = 2.2;
    kctx.strokeRect(33, 40, 13, 9);
    kctx.strokeRect(50, 40, 13, 9);
    kctx.beginPath();
    kctx.moveTo(46, 44);
    kctx.lineTo(50, 44);
    kctx.stroke();

    // Eager eyes
    kctx.fillStyle = '#111';
    kctx.beginPath();
    kctx.arc(39.5, 44.5, 2.5, 0, Math.PI * 2);
    kctx.arc(56.5, 44.5, 2.5, 0, Math.PI * 2);
    kctx.fill();

    // Light beard stubble
    kctx.fillStyle = 'rgba(50, 30, 20, 0.2)';
    kctx.beginPath();
    kctx.arc(48, 58, 12, 0.2, Math.PI - 0.2);
    kctx.fill();

    // Wide enthusiastic smile
    kctx.strokeStyle = '#641E16';
    kctx.lineWidth = 2.2;
    kctx.beginPath();
    kctx.arc(48, 55, 7.5, 0.1, Math.PI - 0.1);
    kctx.stroke();

    scene.textures.addCanvas('avatar_karthik', kCanvas);

    // 4. Auntie Meenakshi (Loving grandma, silver hair, silk saree & jhumkas)
    const mCanvas = document.createElement('canvas');
    mCanvas.width = size;
    mCanvas.height = size;
    const mctx = mCanvas.getContext('2d')!;
    AssetGenerator.drawAvatarCircleBase(mctx, size, '#FCF3CF', '#D4AC0D');

    // Silk saree drape with gold zari
    mctx.fillStyle = '#881B4C';
    mctx.beginPath();
    mctx.moveTo(20, 92);
    mctx.lineTo(48, 68);
    mctx.lineTo(76, 92);
    mctx.closePath();
    mctx.fill();

    mctx.strokeStyle = '#F1C40F';
    mctx.lineWidth = 3;
    mctx.beginPath();
    mctx.moveTo(25, 92);
    mctx.lineTo(60, 70);
    mctx.stroke();

    // Face
    mctx.fillStyle = '#C88A58';
    mctx.beginPath();
    mctx.arc(48, 47, 24, 0, Math.PI * 2);
    mctx.fill();

    // Silver hair tied in neat bun
    mctx.fillStyle = '#BDC3C7';
    mctx.beginPath();
    mctx.arc(48, 42, 27, Math.PI * 0.9, Math.PI * 2.1);
    mctx.fill();
    mctx.beginPath();
    mctx.arc(48, 22, 10, 0, Math.PI * 2);
    mctx.fill();

    // Big red vermilion bindi
    mctx.fillStyle = '#A93226';
    mctx.beginPath();
    mctx.arc(48, 38, 3.2, 0, Math.PI * 2);
    mctx.fill();

    // Gold Jhumka earrings
    mctx.fillStyle = '#F39C12';
    mctx.beginPath();
    mctx.arc(22, 54, 4, 0, Math.PI * 2);
    mctx.arc(74, 54, 4, 0, Math.PI * 2);
    mctx.fill();

    // Kind smiling eyes & warm smile
    mctx.strokeStyle = '#221105';
    mctx.lineWidth = 1.8;
    mctx.beginPath();
    mctx.arc(38, 47, 4, Math.PI * 0.2, Math.PI * 0.8);
    mctx.arc(58, 47, 4, Math.PI * 0.2, Math.PI * 0.8);
    mctx.stroke();

    mctx.beginPath();
    mctx.arc(48, 56, 7.5, 0.2, Math.PI - 0.2);
    mctx.stroke();

    scene.textures.addCanvas('avatar_meenakshi', mCanvas);
  }

  private static drawAvatarCircleBase(
    ctx: CanvasRenderingContext2D,
    size: number,
    bgCol: string,
    borderCol: string
  ): void {
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 4;

    ctx.fillStyle = bgCol;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  /**
   * Generates Level completion stars, mood emotes, and upgrade icons
   */
  private static createProgressionIcons(scene: Phaser.Scene): void {
    // 1. Gold Star (64x64)
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 64;
    starCanvas.height = 64;
    const sctx = starCanvas.getContext('2d')!;

    sctx.shadowColor = 'rgba(243, 167, 18, 0.8)';
    sctx.shadowBlur = 12;

    const starGrad = sctx.createLinearGradient(0, 0, 64, 64);
    starGrad.addColorStop(0, '#FFF275');
    starGrad.addColorStop(0.5, '#F39C12');
    starGrad.addColorStop(1, '#D35400');

    sctx.fillStyle = starGrad;
    AssetGenerator.drawStarPath(sctx, 32, 32, 5, 24, 11);
    sctx.fill();

    sctx.shadowColor = 'transparent';
    sctx.strokeStyle = '#FFFFFF';
    sctx.lineWidth = 1.5;
    AssetGenerator.drawStarPath(sctx, 32, 32, 5, 24, 11);
    sctx.stroke();

    scene.textures.addCanvas('icon_star_gold', starCanvas);

    // 2. Empty Star (64x64)
    const emptyCanvas = document.createElement('canvas');
    emptyCanvas.width = 64;
    emptyCanvas.height = 64;
    const ectx = emptyCanvas.getContext('2d')!;

    ectx.fillStyle = 'rgba(60, 40, 25, 0.6)';
    AssetGenerator.drawStarPath(ectx, 32, 32, 5, 24, 11);
    ectx.fill();

    ectx.strokeStyle = '#D4AF37';
    ectx.lineWidth = 2;
    AssetGenerator.drawStarPath(ectx, 32, 32, 5, 24, 11);
    ectx.stroke();

    scene.textures.addCanvas('icon_star_empty', emptyCanvas);

    // 3. Upgrades Icon (Hammer & Diya)
    const upCanvas = document.createElement('canvas');
    upCanvas.width = 48;
    upCanvas.height = 48;
    const uctx = upCanvas.getContext('2d')!;

    uctx.fillStyle = '#F39C12';
    uctx.beginPath();
    uctx.arc(24, 24, 20, 0, Math.PI * 2);
    uctx.fill();

    uctx.fillStyle = '#FFF8EE';
    uctx.font = '22px sans-serif';
    uctx.textAlign = 'center';
    uctx.textBaseline = 'middle';
    uctx.fillText('🏛️', 24, 24);

    scene.textures.addCanvas('icon_upgrades', upCanvas);
  }

  private static drawStarPath(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerR: number,
    innerR: number
  ): void {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerR;
      y = cy + Math.sin(rot) * outerR;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerR;
      y = cy + Math.sin(rot) * innerR;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
  }
}


