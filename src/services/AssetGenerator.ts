import Phaser from 'phaser';

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
}
