import Phaser from 'phaser';

/**
 * DOSA HOUSE - Realistic Food & Kitchen Equipment Generator
 * Creates photorealistic procedural canvas textures with authentic lighting,
 * materials, specular highlights, and South Indian culinary details.
 */
export class RealisticKitchenAssets {
  public static generateAll(scene: Phaser.Scene): void {
    RealisticKitchenAssets.createCastIronTawa(scene);
    RealisticKitchenAssets.createBatterBowl(scene);
    RealisticKitchenAssets.createGheePot(scene);
    RealisticKitchenAssets.createPotatoMasalaBowl(scene);
    RealisticKitchenAssets.createPodiBowl(scene);
    RealisticKitchenAssets.createShallotsBowl(scene);
    RealisticKitchenAssets.createCoconutChutneyBowl(scene);
    RealisticKitchenAssets.createTomatoChutneyBowl(scene);
    RealisticKitchenAssets.createSambarBowl(scene);
    RealisticKitchenAssets.createBananaLeafPlatter(scene);
    RealisticKitchenAssets.createSpatula(scene);
    RealisticKitchenAssets.createWaterCup(scene);
    RealisticKitchenAssets.createOrderTicketBase(scene);
  }

  /**
   * 1. Realistic Heavy Seasoned Cast-Iron Tawa (Kal Tawa)
   * Circular flat griddle with dark cast patina, concentric lathe rings,
   * raised bevel rim, oil sheen, and sturdy handle.
   */
  private static createCastIronTawa(scene: Phaser.Scene): void {
    const size = 520;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const cx = size / 2 - 25;
    const cy = size / 2;
    const r = 205;

    // Outer Drop Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 12;

    // Handle extending to the top-right
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-Math.PI / 4);

    const handleGrad = ctx.createLinearGradient(r - 5, -20, r + 90, 20);
    handleGrad.addColorStop(0, '#1c1b1a');
    handleGrad.addColorStop(0.5, '#2e2b28');
    handleGrad.addColorStop(1, '#181716');

    ctx.fillStyle = handleGrad;
    RealisticKitchenAssets.drawRoundedRect(ctx, r - 10, -18, 105, 36, 12);
    ctx.fill();

    // Handle hole
    ctx.fillStyle = '#0f0e0d';
    ctx.beginPath();
    ctx.arc(r + 75, 0, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();

    // Main Tawa Body Base
    const baseGrad = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, r);
    baseGrad.addColorStop(0, '#262422'); // seasoned center
    baseGrad.addColorStop(0.4, '#1c1a19');
    baseGrad.addColorStop(0.8, '#141312');
    baseGrad.addColorStop(1, '#0b0a0a'); // deep edge

    ctx.fillStyle = baseGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Clear shadow for surface grain
    ctx.shadowColor = 'transparent';

    // Cast-iron micro grain texture
    const grainImg = ctx.createImageData(size, size);
    for (let i = 0; i < grainImg.data.length; i += 4) {
      const v = Math.random() * 24;
      grainImg.data[i] = v;
      grainImg.data[i + 1] = v;
      grainImg.data[i + 2] = v;
      grainImg.data[i + 3] = Math.random() > 0.6 ? 22 : 0;
    }
    ctx.putImageData(grainImg, 0, 0);

    // Redraw mask over grain
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.arc(cx, cy, r + 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Lathe Turning Rings (Concentric micro-grooves)
    for (let radius = 25; radius < r - 12; radius += 14) {
      ctx.strokeStyle = radius % 28 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Outer Raised Bevel Rim
    const rimGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)'); // metallic top highlight
    rimGrad.addColorStop(0.5, 'rgba(60, 56, 52, 0.6)');
    rimGrad.addColorStop(1, 'rgba(0, 0, 0, 0.85)'); // bottom shade

    ctx.strokeStyle = rimGrad;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 4, 0, Math.PI * 2);
    ctx.stroke();

    // Subtle Oil Seasoning Sheen (Golden amber glow in center where batter cooks)
    const sheenGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 140);
    sheenGrad.addColorStop(0, 'rgba(243, 167, 18, 0.12)');
    sheenGrad.addColorStop(0.5, 'rgba(212, 130, 10, 0.06)');
    sheenGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = sheenGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 140, 0, Math.PI * 2);
    ctx.fill();

    scene.textures.addCanvas('realistic_cast_iron_tawa', canvas);
  }

  /**
   * 2. Fermented Batter Bowl with Ladle
   * Polished stainless steel bowl filled with bubbly white fermented batter
   */
  private static createBatterBowl(scene: Phaser.Scene): void {
    const size = 190;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const cx = size / 2;
    const cy = size / 2;
    const r = 74;

    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 6;

    // Stainless Steel Outer Rim
    const steelGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    steelGrad.addColorStop(0, '#FFFFFF');
    steelGrad.addColorStop(0.3, '#CCCCCC');
    steelGrad.addColorStop(0.7, '#888888');
    steelGrad.addColorStop(1, '#555555');

    ctx.fillStyle = steelGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = 'transparent';

    // Batter Surface
    const batterGrad = ctx.createRadialGradient(cx - 15, cy - 15, 10, cx, cy, r - 8);
    batterGrad.addColorStop(0, '#FFFFFF');
    batterGrad.addColorStop(0.6, '#F8F6F0');
    batterGrad.addColorStop(1, '#ECE7DC');

    ctx.fillStyle = batterGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 8, 0, Math.PI * 2);
    ctx.fill();

    // Fermentation Micro-Bubbles
    const bubbles = [
      { x: cx - 25, y: cy - 18, rad: 5.5 },
      { x: cx + 18, y: cy - 30, rad: 4 },
      { x: cx - 12, y: cy + 22, rad: 6 },
      { x: cx + 28, y: cy + 14, rad: 4.5 },
      { x: cx - 35, y: cy + 10, rad: 3.5 },
      { x: cx + 5, y: cy - 8, rad: 5 }
    ];

    bubbles.forEach(b => {
      ctx.fillStyle = 'rgba(235, 230, 220, 0.9)';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.rad, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(200, 190, 175, 0.7)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(b.x - b.rad * 0.3, b.y - b.rad * 0.3, b.rad * 0.35, 0, Math.PI * 2);
      ctx.fill();
    });

    // Ladle Handle extending across the bowl
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(0.65);

    const ladleGrad = ctx.createLinearGradient(-15, -60, 15, 60);
    ladleGrad.addColorStop(0, '#EEEEEE');
    ladleGrad.addColorStop(0.5, '#AAAAAA');
    ladleGrad.addColorStop(1, '#777777');

    ctx.fillStyle = ladleGrad;
    ctx.fillRect(-6, -72, 12, 90);

    // Ladle cup outline submerged
    ctx.fillStyle = 'rgba(240, 238, 230, 0.85)';
    ctx.beginPath();
    ctx.arc(0, 12, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.restore();

    scene.textures.addCanvas('realistic_batter_bowl', canvas);
  }

  /**
   * 3. Traditional Brass Ghee Cup with Golden Ghee & Basting Brush
   */
  private static createGheePot(scene: Phaser.Scene): void {
    const size = 150;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const cx = size / 2;
    const cy = size / 2;
    const r = 54;

    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 5;

    // Brass Pot Rim
    const brassGrad = ctx.createRadialGradient(cx - 20, cy - 20, 5, cx, cy, r);
    brassGrad.addColorStop(0, '#FFE899');
    brassGrad.addColorStop(0.4, '#D4AF37');
    brassGrad.addColorStop(0.8, '#99751D');
    brassGrad.addColorStop(1, '#5C440E');

    ctx.fillStyle = brassGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = 'transparent';

    // Molten Liquid Cow Ghee (Golden Amber)
    const gheeGrad = ctx.createRadialGradient(cx - 10, cy - 10, 5, cx, cy, r - 7);
    gheeGrad.addColorStop(0, '#FFF275');
    gheeGrad.addColorStop(0.4, '#FFC107');
    gheeGrad.addColorStop(0.8, '#E59500');
    gheeGrad.addColorStop(1, '#B26A00');

    ctx.fillStyle = gheeGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 7, 0, Math.PI * 2);
    ctx.fill();

    // Oil gloss reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.ellipse(cx - 15, cy - 15, 18, 9, -0.6, 0, Math.PI * 2);
    ctx.fill();

    // Basting Brush Handle
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.8);

    // Wooden handle
    ctx.fillStyle = '#653E26';
    RealisticKitchenAssets.drawRoundedRect(ctx, -6, -65, 12, 60, 4);
    ctx.fill();

    // Metal ferrule
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(-7, -8, 14, 12);

    // Natural bristles soaked in golden ghee
    ctx.fillStyle = '#E59500';
    ctx.beginPath();
    ctx.moveTo(-6, 4);
    ctx.lineTo(6, 4);
    ctx.lineTo(8, 22);
    ctx.lineTo(-8, 22);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    scene.textures.addCanvas('realistic_ghee_cup', canvas);
  }

  /**
   * 4. Spiced Potato Masala (Aloo Bhaji) Bowl
   * Yellow turmeric spiced crushed potatoes with black mustard seeds and curry leaves
   */
  private static createPotatoMasalaBowl(scene: Phaser.Scene): void {
    const size = 150;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const cx = size / 2;
    const cy = size / 2;
    const r = 56;

    // Steel Katori
    RealisticKitchenAssets.drawSteelBowlBase(ctx, cx, cy, r);

    // Spiced Potato Filling Base
    const potGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, r - 6);
    potGrad.addColorStop(0, '#FFD54F');
    potGrad.addColorStop(0.5, '#FFCA28');
    potGrad.addColorStop(0.85, '#F57F17');
    potGrad.addColorStop(1, '#D87010');

    ctx.fillStyle = potGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
    ctx.fill();

    // Potato textured chunks
    const chunks = [
      { x: cx - 18, y: cy - 14, rad: 14, col: '#FFE082' },
      { x: cx + 16, y: cy - 18, rad: 16, col: '#FFD54F' },
      { x: cx - 12, y: cy + 16, rad: 18, col: '#FFCA28' },
      { x: cx + 15, y: cy + 12, rad: 13, col: '#FFE082' },
      { x: cx + 2, y: cy - 2, rad: 12, col: '#FFF59D' }
    ];

    chunks.forEach(c => {
      ctx.fillStyle = c.col;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.rad, 0, Math.PI * 2);
      ctx.fill();
    });

    // Sliced onion slivers (translucent purple-white)
    ctx.strokeStyle = 'rgba(215, 189, 226, 0.85)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx - 10, cy - 8, 14, 0.2, 2.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 8, cy + 12, 16, 2.8, 4.6);
    ctx.stroke();

    // Mustard Seeds (Black dots)
    ctx.fillStyle = '#111111';
    for (let i = 0; i < 24; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = Math.random() * (r - 16);
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glossy Curry Leaves
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath();
    ctx.ellipse(cx + 8, cy - 12, 10, 5, 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx - 14, cy + 8, 11, 6, -0.4, 0, Math.PI * 2);
    ctx.fill();

    scene.textures.addCanvas('realistic_potato_masala_bowl', canvas);
  }

  /**
   * 5. Fiery Gunpowder Podi (Idli Milagai Podi) Bowl
   * Coarse ruby red roasted lentil and red chili spice powder
   */
  private static createPodiBowl(scene: Phaser.Scene): void {
    const size = 140;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const cx = size / 2;
    const cy = size / 2;
    const r = 50;

    RealisticKitchenAssets.drawSteelBowlBase(ctx, cx, cy, r);

    // Deep ruby red spice powder base
    const podiGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, r - 6);
    podiGrad.addColorStop(0, '#E74C3C');
    podiGrad.addColorStop(0.5, '#C0392B');
    podiGrad.addColorStop(0.85, '#962D22');
    podiGrad.addColorStop(1, '#641E16');

    ctx.fillStyle = podiGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
    ctx.fill();

    // Coarse spice grains (paprika, roasted urad dal, sesame flecks)
    for (let i = 0; i < 90; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = Math.random() * (r - 10);
      const px = cx + Math.cos(a) * d;
      const py = cy + Math.sin(a) * d;

      ctx.fillStyle = Math.random() > 0.4 ? '#F39C12' : '#F1C40F';
      ctx.beginPath();
      ctx.arc(px, py, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Molten ghee drop well in the center
    const wellGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 14);
    wellGrad.addColorStop(0, '#FFCA28');
    wellGrad.addColorStop(0.7, '#D35400');
    wellGrad.addColorStop(1, 'rgba(192, 57, 43, 0)');

    ctx.fillStyle = wellGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();

    scene.textures.addCanvas('realistic_podi_bowl', canvas);
  }

  /**
   * 6. Sliced Shallots & Green Chillies Bowl
   */
  private static createShallotsBowl(scene: Phaser.Scene): void {
    const size = 140;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const cx = size / 2;
    const cy = size / 2;
    const r = 50;

    RealisticKitchenAssets.drawSteelBowlBase(ctx, cx, cy, r);

    ctx.fillStyle = '#2A1810';
    ctx.beginPath();
    ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
    ctx.fill();

    // Sliced Shallot Rings
    for (let i = 0; i < 18; i++) {
      const a = (i * Math.PI * 2) / 18;
      const d = 8 + (i % 3) * 12;
      const sx = cx + Math.cos(a) * d;
      const sy = cy + Math.sin(a) * d;

      ctx.strokeStyle = '#8E44AD';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(sx, sy, 9, 6, i * 0.4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#F4ECF7';
      ctx.fill();
    }

    // Chopped spicy green chillies
    for (let j = 0; j < 8; j++) {
      const a = (j * Math.PI * 2) / 8 + 0.3;
      const d = 16 + (j % 2) * 14;
      ctx.fillStyle = '#27AE60';
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    scene.textures.addCanvas('realistic_shallots_bowl', canvas);
  }

  /**
   * 7. Creamy Stone-Ground Coconut Chutney Bowl
   * White coconut chutney with black mustard seeds and red chilli tadka
   */
  private static createCoconutChutneyBowl(scene: Phaser.Scene): void {
    const size = 130;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const cx = size / 2;
    const cy = size / 2;
    const r = 48;

    RealisticKitchenAssets.drawSteelBowlBase(ctx, cx, cy, r);

    // Creamy Stone-Ground Chutney
    const chutGrad = ctx.createRadialGradient(cx - 8, cy - 8, 6, cx, cy, r - 6);
    chutGrad.addColorStop(0, '#FFFFFF');
    chutGrad.addColorStop(0.7, '#F7F5EE');
    chutGrad.addColorStop(1, '#ECE7DC');

    ctx.fillStyle = chutGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
    ctx.fill();

    // Tadka: Black Mustard Seeds
    ctx.fillStyle = '#1A1816';
    for (let i = 0; i < 18; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = Math.random() * (r - 14);
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Dried Byadagi Red Chilli piece
    ctx.fillStyle = '#C0392B';
    ctx.beginPath();
    ctx.ellipse(cx - 2, cy - 4, 8, 3.5, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Curved Glossy Curry Leaf
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath();
    ctx.ellipse(cx + 8, cy + 6, 9, 4.5, -0.6, 0, Math.PI * 2);
    ctx.fill();

    scene.textures.addCanvas('realistic_coconut_chutney_bowl', canvas);
  }

  /**
   * 8. Roasted Red Tomato-Kara Chutney Bowl
   */
  private static createTomatoChutneyBowl(scene: Phaser.Scene): void {
    const size = 130;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const cx = size / 2;
    const cy = size / 2;
    const r = 48;

    RealisticKitchenAssets.drawSteelBowlBase(ctx, cx, cy, r);

    const redGrad = ctx.createRadialGradient(cx - 8, cy - 8, 5, cx, cy, r - 6);
    redGrad.addColorStop(0, '#E74C3C');
    redGrad.addColorStop(0.5, '#C0392B');
    redGrad.addColorStop(0.85, '#A93226');
    redGrad.addColorStop(1, '#7B241C');

    ctx.fillStyle = redGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
    ctx.fill();

    // Tadka mustard seeds
    ctx.fillStyle = '#111111';
    for (let i = 0; i < 16; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = Math.random() * (r - 14);
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fresh coriander leaf sprig
    ctx.fillStyle = '#27AE60';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 7, 4, 0.7, 0, Math.PI * 2);
    ctx.fill();

    scene.textures.addCanvas('realistic_tomato_chutney_bowl', canvas);
  }

  /**
   * 9. Drumstick Vegetable Sambar Bowl
   */
  private static createSambarBowl(scene: Phaser.Scene): void {
    const size = 140;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const cx = size / 2;
    const cy = size / 2;
    const r = 52;

    RealisticKitchenAssets.drawSteelBowlBase(ctx, cx, cy, r);

    // Aromatic Sambar Lentil Broth
    const samGrad = ctx.createRadialGradient(cx - 10, cy - 10, 6, cx, cy, r - 6);
    samGrad.addColorStop(0, '#F39C12');
    samGrad.addColorStop(0.5, '#E67E22');
    samGrad.addColorStop(0.85, '#D35400');
    samGrad.addColorStop(1, '#935116');

    ctx.fillStyle = samGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
    ctx.fill();

    // Drumstick piece (Murungakkai) floating
    ctx.fillStyle = '#1E8449';
    RealisticKitchenAssets.drawRoundedRect(ctx, cx - 18, cy - 10, 24, 9, 3);
    ctx.fill();
    ctx.strokeStyle = '#145A32';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Floating coriander garnish
    ctx.fillStyle = '#2ECC71';
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI * 2) / 6;
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(a) * 14, cy + Math.sin(a) * 14, 5, 3, a, 0, Math.PI * 2);
      ctx.fill();
    }

    scene.textures.addCanvas('realistic_sambar_bowl', canvas);
  }

  /**
   * 10. Fresh Plantain / Banana Leaf Platter
   * Lush emerald banana leaf serving plate with visible veins and natural sheen
   */
  private static createBananaLeafPlatter(scene: Phaser.Scene): void {
    const width = 500;
    const height = 240;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    const cx = width / 2;
    const cy = height / 2;

    // Drop Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;

    // Leaf Outline (Curved oval leaf cut)
    ctx.beginPath();
    ctx.ellipse(cx, cy, width / 2 - 20, height / 2 - 16, 0, 0, Math.PI * 2);

    const leafGrad = ctx.createLinearGradient(0, 0, width, height);
    leafGrad.addColorStop(0, '#2ECC71');
    leafGrad.addColorStop(0.3, '#27AE60');
    leafGrad.addColorStop(0.7, '#1E8449');
    leafGrad.addColorStop(1, '#145A32');

    ctx.fillStyle = leafGrad;
    ctx.fill();

    ctx.shadowColor = 'transparent';

    // Central Midrib Vein (Yellow-green spine)
    ctx.strokeStyle = '#A9DFBF';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(25, cy);
    ctx.bezierCurveTo(cx * 0.6, cy - 4, cx * 1.4, cy + 4, width - 25, cy);
    ctx.stroke();

    // Lateral Ribbed Veins (Authentic parallel plantain leaf structure)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.2;

    for (let x = 40; x < width - 40; x += 18) {
      // Top branch
      ctx.beginPath();
      ctx.moveTo(x, cy);
      ctx.lineTo(x + 24, 25);
      ctx.stroke();

      // Bottom branch
      ctx.beginPath();
      ctx.moveTo(x, cy);
      ctx.lineTo(x + 24, height - 25);
      ctx.stroke();
    }

    // Soft Satin Leaf Sheen
    const sheenGrad = ctx.createLinearGradient(0, 0, 0, height);
    sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    sheenGrad.addColorStop(1, 'rgba(0, 0, 0, 0.2)');

    ctx.fillStyle = sheenGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, width / 2 - 20, height / 2 - 16, 0, 0, Math.PI * 2);
    ctx.fill();

    scene.textures.addCanvas('realistic_banana_leaf_platter', canvas);
  }

  /**
   * 11. Stainless Steel & Rosewood Dosa Spatula (Thiruppi)
   */
  private static createSpatula(scene: Phaser.Scene): void {
    const width = 190;
    const height = 65;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // Blade
    const bladeGrad = ctx.createLinearGradient(0, 0, 70, 0);
    bladeGrad.addColorStop(0, '#FFFFFF');
    bladeGrad.addColorStop(0.5, '#CCCCCC');
    bladeGrad.addColorStop(1, '#888888');

    ctx.fillStyle = bladeGrad;
    RealisticKitchenAssets.drawRoundedRect(ctx, 10, 14, 65, 36, 4);
    ctx.fill();

    // Beveled leading edge
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, 16);
    ctx.lineTo(10, 48);
    ctx.stroke();

    // Metal neck
    ctx.fillStyle = '#999999';
    ctx.fillRect(75, 27, 35, 10);

    // Rosewood Handle
    const woodGrad = ctx.createLinearGradient(110, 20, 180, 45);
    woodGrad.addColorStop(0, '#5C341C');
    woodGrad.addColorStop(0.5, '#3D2314');
    woodGrad.addColorStop(1, '#24140B');

    ctx.fillStyle = woodGrad;
    RealisticKitchenAssets.drawRoundedRect(ctx, 105, 20, 75, 24, 6);
    ctx.fill();

    // Brass Rivets
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(125, 32, 2.5, 0, Math.PI * 2);
    ctx.arc(155, 32, 2.5, 0, Math.PI * 2);
    ctx.fill();

    scene.textures.addCanvas('realistic_spatula', canvas);
  }

  /**
   * 12. Stainless Steel Tumbler with Water for Sizzle Testing
   */
  private static createWaterCup(scene: Phaser.Scene): void {
    const size = 90;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const cx = size / 2;
    const cy = size / 2;
    const r = 32;

    RealisticKitchenAssets.drawSteelBowlBase(ctx, cx, cy, r);

    // Water surface
    const waterGrad = ctx.createRadialGradient(cx - 5, cy - 5, 2, cx, cy, r - 5);
    waterGrad.addColorStop(0, '#D6EAF8');
    waterGrad.addColorStop(0.6, '#AED6F1');
    waterGrad.addColorStop(1, '#5DADE2');

    ctx.fillStyle = waterGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 5, 0, Math.PI * 2);
    ctx.fill();

    // Ripple
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.stroke();

    scene.textures.addCanvas('realistic_water_cup', canvas);
  }

  /**
   * 13. Customer Order Ticket Card Background
   */
  private static createOrderTicketBase(scene: Phaser.Scene): void {
    const width = 230;
    const height = 150;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // Drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 6;

    // Aged Ivory Paper
    const paperGrad = ctx.createLinearGradient(0, 0, 0, height);
    paperGrad.addColorStop(0, '#FFFDF5');
    paperGrad.addColorStop(0.5, '#FFF8E7');
    paperGrad.addColorStop(1, '#F7EECF');

    ctx.fillStyle = paperGrad;
    RealisticKitchenAssets.drawRoundedRect(ctx, 8, 8, width - 16, height - 16, 8);
    ctx.fill();

    ctx.shadowColor = 'transparent';

    // Top Brass Clip Stud
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(width / 2, 8, 9, 0, Math.PI * 2);
    ctx.fill();

    // Red perforated / stitch border
    ctx.strokeStyle = 'rgba(193, 92, 61, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    RealisticKitchenAssets.drawRoundedRect(ctx, 12, 14, width - 24, height - 24, 6);
    ctx.stroke();

    scene.textures.addCanvas('ui_order_ticket_card', canvas);
  }

  private static drawSteelBowlBase(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;

    const steel = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    steel.addColorStop(0, '#FFFFFF');
    steel.addColorStop(0.3, '#E0E0E0');
    steel.addColorStop(0.65, '#9E9E9E');
    steel.addColorStop(1, '#616161');

    ctx.fillStyle = steel;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = 'transparent';

    // Metallic rim highlight
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 2, -Math.PI * 0.8, -Math.PI * 0.1);
    ctx.stroke();
  }

  private static drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ): void {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}
