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
    this.backdrop = scene.add.rectangle(width / 2, height / 2, width, height, 0x0a0502, 0.75);
    this.backdrop.setInteractive();
    this.add(this.backdrop);

    // Main Modal Panel
    this.panel = scene.add.container(width / 2, height / 2);
    this.add(this.panel);

    const modalW = 1040;
    const modalH = 580;

    // Panel Board (Deep rosewood background with brass border)
    const boardGraphics = scene.add.graphics();
    // Shadow
    boardGraphics.fillStyle(0x000000, 0.5);
    boardGraphics.fillRoundedRect(-modalW / 2 + 10, -modalH / 2 + 14, modalW, modalH, 20);

    // Wood base
    boardGraphics.fillStyle(THEME.colors.teakWood, 1);
    boardGraphics.fillRoundedRect(-modalW / 2, -modalH / 2, modalW, modalH, 20);

    // Inner parchment background
    boardGraphics.fillStyle(THEME.colors.creamWarm, 1);
    boardGraphics.fillRoundedRect(-modalW / 2 + 16, -modalH / 2 + 16, modalW - 32, modalH - 32, 14);

    // Divider line between left list and right details
    boardGraphics.lineStyle(2.5, THEME.colors.terracotta, 0.35);
    boardGraphics.lineBetween(-modalW / 2 + 330, -modalH / 2 + 30, -modalW / 2 + 330, modalH / 2 - 30);

    // Brass outer border
    boardGraphics.lineStyle(4, THEME.colors.brass, 0.9);
    boardGraphics.strokeRoundedRect(-modalW / 2, -modalH / 2, modalW, modalH, 20);

    // Inner decorative gold line
    boardGraphics.lineStyle(1.5, THEME.colors.turmericGold, 0.6);
    boardGraphics.strokeRoundedRect(-modalW / 2 + 8, -modalH / 2 + 8, modalW - 16, modalH - 16, 16);

    this.panel.add(boardGraphics);

    // Header Title
    const headerTitle = scene.add.text(-modalW / 2 + 30, -modalH / 2 + 30, 'ROYAL RECIPE BOOK', {
      fontFamily: THEME.fonts.title,
      fontSize: '28px',
      color: THEME.colors.teakWoodHex
    });
    this.panel.add(headerTitle);

    const subHeader = scene.add.text(-modalW / 2 + 30, -modalH / 2 + 64, 'Master authentic South Indian tawa creations', {
      fontFamily: THEME.fonts.body,
      fontSize: '13px',
      color: THEME.colors.terracottaHex
    });
    this.panel.add(subHeader);

    // Close Button
    const closeBtn = scene.add.image(modalW / 2 - 36, -modalH / 2 + 36, 'icon_close');
    closeBtn.setInteractive({ useHandCursor: true });
    closeBtn.on('pointerover', () => closeBtn.setScale(1.15));
    closeBtn.on('pointerout', () => closeBtn.setScale(1.0));
    closeBtn.on('pointerdown', () => {
      SoundFX.getInstance().playClick();
      this.closeModal(onClose);
    });
    this.panel.add(closeBtn);

    // Details Container (Right side)
    this.detailsContainer = scene.add.container(-modalW / 2 + 355, -modalH / 2 + 40);
    this.panel.add(this.detailsContainer);

    // Build Left Sidebar Recipe List
    this.buildRecipeList(scene, -modalW / 2 + 30, -modalH / 2 + 100);

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
    const itemW = 280;
    const itemH = 68;

    RECIPES.forEach((recipe, idx) => {
      const y = startY + idx * (itemH + 10);
      const itemContainer = scene.add.container(startX, y);

      const bg = scene.add.graphics();
      const isSelected = recipe.id === this.selectedRecipe.id;
      const isUnlocked = registry.isUnlocked(recipe.id);

      this.drawItemBg(bg, itemW, itemH, isSelected, isUnlocked);
      itemContainer.add(bg);

      // Recipe Title
      const title = scene.add.text(14, 12, recipe.name, {
        fontFamily: THEME.fonts.title,
        fontSize: '16px',
        color: isSelected ? THEME.colors.creamHex : THEME.colors.teakWoodHex
      });
      itemContainer.add(title);

      // Tamil subtitle or tagline
      const subtitle = scene.add.text(14, 34, isUnlocked ? recipe.tamilName : '🔒 Locked in Kitchen', {
        fontFamily: THEME.fonts.body,
        fontSize: '12px',
        fontStyle: isUnlocked ? 'normal' : 'italic',
        color: isSelected ? THEME.colors.turmericBrightHex : (isUnlocked ? THEME.colors.curryGreenHex : '#888888')
      });
      itemContainer.add(subtitle);

      // Prep Time Badge
      const timeBadge = scene.add.text(itemW - 14, 14, `⏱ ${recipe.cookingTimeSec}s`, {
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
          bg.fillRoundedRect(0, 0, itemW, itemH, 10);
          bg.lineStyle(1.5, THEME.colors.turmeric, 0.8);
          bg.strokeRoundedRect(0, 0, itemW, itemH, 10);
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
      g.fillRoundedRect(0, 0, w, h, 10);
      g.lineStyle(2, THEME.colors.turmeric, 1);
      g.strokeRoundedRect(0, 0, w, h, 10);
    } else {
      g.fillStyle(unlocked ? 0xEDE2CF : 0xE0D3BD, 0.9);
      g.fillRoundedRect(0, 0, w, h, 10);
      g.lineStyle(1.5, unlocked ? THEME.colors.terracotta : 0xBBBBBB, 0.4);
      g.strokeRoundedRect(0, 0, w, h, 10);
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
      this.drawItemBg(bg, 280, 68, isSelected, isUnlocked);

      title.setColor(isSelected ? THEME.colors.creamHex : THEME.colors.teakWoodHex);
      subtitle.setColor(isSelected ? THEME.colors.turmericBrightHex : (isUnlocked ? THEME.colors.curryGreenHex : '#888888'));
      timeBadge.setColor(isSelected ? THEME.colors.creamHex : THEME.colors.terracottaHex);
    });
  }

  private renderRecipeDetails(scene: Phaser.Scene): void {
    this.detailsContainer.removeAll(true);
    const r = this.selectedRecipe;

    // Title
    const title = scene.add.text(0, 0, r.name, {
      fontFamily: THEME.fonts.title,
      fontSize: '28px',
      color: THEME.colors.teakWoodHex
    });
    this.detailsContainer.add(title);

    // Tamil Name & Tagline
    const sub = scene.add.text(0, 36, `${r.tamilName} • "${r.tagline}"`, {
      fontFamily: THEME.fonts.body,
      fontSize: '13px',
      fontStyle: 'bold',
      color: THEME.colors.terracottaHex
    });
    this.detailsContainer.add(sub);

    // Badges Row (Difficulty, Fold Type, Calories)
    let badgeX = 0;
    const badgeY = 66;

    // Difficulty Stars
    const diffStars = '★'.repeat(r.difficulty) + '☆'.repeat(3 - r.difficulty);
    const diffBadge = scene.add.text(badgeX, badgeY, `Difficulty: ${diffStars}`, {
      fontFamily: THEME.fonts.body,
      fontSize: '12px',
      fontStyle: 'bold',
      color: THEME.colors.turmericGoldHex
    });
    this.detailsContainer.add(diffBadge);
    badgeX += 160;

    // Calories
    const calBadge = scene.add.text(badgeX, badgeY, `⚡ ${r.calories}`, {
      fontFamily: THEME.fonts.body,
      fontSize: '12px',
      fontStyle: 'bold',
      color: THEME.colors.curryGreenHex
    });
    this.detailsContainer.add(calBadge);
    badgeX += 120;

    // Fold Style
    const foldBadge = scene.add.text(badgeX, badgeY, `📐 Fold: ${r.foldType.replace('_', ' ').toUpperCase()}`, {
      fontFamily: THEME.fonts.body,
      fontSize: '12px',
      fontStyle: 'bold',
      color: THEME.colors.teakWoodHex
    });
    this.detailsContainer.add(foldBadge);

    // Description
    const desc = scene.add.text(0, 96, r.description, {
      fontFamily: THEME.fonts.body,
      fontSize: '13px',
      color: '#3A271B',
      wordWrap: { width: 630 },
      lineSpacing: 4
    });
    this.detailsContainer.add(desc);

    // Section 1: Ingredients Needed
    const ingTitle = scene.add.text(0, 166, 'ESSENTIAL INGREDIENTS', {
      fontFamily: THEME.fonts.title,
      fontSize: '15px',
      color: THEME.colors.terracottaHex
    });
    this.detailsContainer.add(ingTitle);

    let ingY = 192;
    r.ingredients.forEach((ing) => {
      const ingRow = scene.add.text(12, ingY, `${ing.icon}  ${ing.name} — ${ing.amountText}`, {
        fontFamily: THEME.fonts.body,
        fontSize: '12.5px',
        color: THEME.colors.teakWoodHex
      });
      this.detailsContainer.add(ingRow);
      ingY += 22;
    });

    // Section 2: Preparation & Tawa Steps
    const stepsTitle = scene.add.text(0, ingY + 12, 'CHEF\'S TAWA TECHNIQUE', {
      fontFamily: THEME.fonts.title,
      fontSize: '15px',
      color: THEME.colors.terracottaHex
    });
    this.detailsContainer.add(stepsTitle);

    let stepY = ingY + 36;
    r.steps.forEach((st) => {
      const stepRow = scene.add.text(12, stepY, `Step ${st.stepNumber}: ${st.instruction}`, {
        fontFamily: THEME.fonts.body,
        fontSize: '12.5px',
        color: '#2B1C12',
        wordWrap: { width: 610 }
      });
      this.detailsContainer.add(stepRow);
      stepY += 22;
    });

    // Section 3: Lore & Cultural Tradition Box
    const loreBoxY = 415;
    const loreG = scene.add.graphics();
    loreG.fillStyle(THEME.colors.curryGreen, 0.1);
    loreG.fillRoundedRect(0, loreBoxY, 630, 68, 8);
    loreG.lineStyle(1.5, THEME.colors.curryGreen, 0.4);
    loreG.strokeRoundedRect(0, loreBoxY, 630, 68, 8);
    this.detailsContainer.add(loreG);

    const loreTitle = scene.add.text(12, loreBoxY + 8, 'SOUTH INDIAN HERITAGE & LORE', {
      fontFamily: THEME.fonts.title,
      fontSize: '12px',
      color: THEME.colors.curryGreenHex
    });
    this.detailsContainer.add(loreTitle);

    const loreText = scene.add.text(12, loreBoxY + 28, r.lore, {
      fontFamily: THEME.fonts.body,
      fontSize: '11.5px',
      color: '#26442C',
      fontStyle: 'italic',
      wordWrap: { width: 605 }
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
