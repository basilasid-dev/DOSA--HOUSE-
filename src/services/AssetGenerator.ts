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
  }
}

