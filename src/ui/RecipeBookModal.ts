import Phaser from 'phaser';
import { THEME } from '../config/theme';
import { SoundFX } from '../audio/SoundFX';
import { RecipeService, RECIPES } from '../services/RecipeRegistry';
import { UpgradeService } from '../services/UpgradeService';
import { Recipe } from '../types/recipe';

export class RecipeBookModal extends Phaser.GameObjects.Container {
  private backdrop: Phaser.GameObjects.Rectangle;
  private panel: Phaser.GameObjects.Container;
  private selectedRecipe: Recipe;
  private currentPage: number = 0; // 0 = page 1 (recipes 0-4), 1 = page 2 (recipes 5-9)
  private recipesPerPage: number = 5;
  private recipeButtons: Phaser.GameObjects.Container[] = [];
  private detailsContainer: Phaser.GameObjects.Container;
  private listContainer: Phaser.GameObjects.Container;
  private pageIndicatorText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, onClose: () => void) {
    super(scene, 0, 0);

    const { width, height } = THEME.dimensions;
    this.selectedRecipe = RECIPES[0];

    // Dark backdrop overlay
    this.backdrop = scene.add.rectangle(width / 2, height / 2, width, height, 0x0a0502, 0.8);
    this.backdrop.setInteractive();
    this.add(this.backdrop);

    // Main Modal Panel
    this.panel = scene.add.container(width / 2, height / 2);
    this.add(this.panel);

    const modalW = 1120;
    const modalH = 620;

    // Panel Board Graphics
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
    boardGraphics.lineBetween(-modalW / 2 + 310, -modalH / 2 + 25, -modalW / 2 + 310, modalH / 2 - 25);

    // Brass outer border
    boardGraphics.lineStyle(4, THEME.colors.brass, 0.95);
    boardGraphics.strokeRoundedRect(-modalW / 2, -modalH / 2, modalW, modalH, 20);

    // Inner gold line
    boardGraphics.lineStyle(1.5, THEME.colors.turmericGold, 0.6);
    boardGraphics.strokeRoundedRect(-modalW / 2 + 8, -modalH / 2 + 8, modalW - 16, modalH - 16, 16);

    this.panel.add(boardGraphics);

    // Header Title
    const headerTitle = scene.add.text(-modalW / 2 + 26, -modalH / 2 + 26, 'ROYAL RECIPE BOOK (10 DOSAS)', {
      fontFamily: THEME.fonts.title,
      fontSize: '24px',
      color: THEME.colors.teakWoodHex
    });
    this.panel.add(headerTitle);

    const subHeader = scene.add.text(-modalW / 2 + 26, -modalH / 2 + 56, 'Heritage tawa crepes, ingredients & chef techniques', {
      fontFamily: THEME.fonts.body,
      fontSize: '11.5px',
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

    // Left List Container
    this.listContainer = scene.add.container(-modalW / 2 + 24, -modalH / 2 + 85);
    this.panel.add(this.listContainer);

    // Pagination Footer (Left bottom)
    const pageNavY = modalH / 2 - 42;
    const prevBtn = scene.add.text(-modalW / 2 + 35, pageNavY, '◀ PREV', {
      fontFamily: THEME.fonts.title,
      fontSize: '12px',
      color: THEME.colors.teakWoodHex
    });
    prevBtn.setInteractive({ useHandCursor: true });
    prevBtn.on('pointerdown', () => {
      if (this.currentPage > 0) {
        SoundFX.getInstance().playPageTurn();
        this.currentPage--;
        this.renderRecipeList(scene);
      }
    });
    this.panel.add(prevBtn);

    this.pageIndicatorText = scene.add.text(-modalW / 2 + 160, pageNavY, 'PAGE 1 / 2', {
      fontFamily: THEME.fonts.body,
      fontSize: '11px',
      fontStyle: 'bold',
      color: THEME.colors.terracottaHex
    }).setOrigin(0.5, 0);
    this.panel.add(this.pageIndicatorText);

    const nextBtn = scene.add.text(-modalW / 2 + 235, pageNavY, 'NEXT ▶', {
      fontFamily: THEME.fonts.title,
      fontSize: '12px',
      color: THEME.colors.teakWoodHex
    });
    nextBtn.setInteractive({ useHandCursor: true });
    nextBtn.on('pointerdown', () => {
      if ((this.currentPage + 1) * this.recipesPerPage < RECIPES.length) {
        SoundFX.getInstance().playPageTurn();
        this.currentPage++;
        this.renderRecipeList(scene);
      }
    });
    this.panel.add(nextBtn);

    // Details Container (Right side)
    this.detailsContainer = scene.add.container(-modalW / 2 + 330, -modalH / 2 + 30);
    this.panel.add(this.detailsContainer);

    // Initial render
    this.renderRecipeList(scene);
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

  private renderRecipeList(scene: Phaser.Scene): void {
    this.listContainer.removeAll(true);
    this.recipeButtons = [];
    const registry = RecipeService.getInstance();

    const startIdx = this.currentPage * this.recipesPerPage;
    const pageRecipes = RECIPES.slice(startIdx, startIdx + this.recipesPerPage);
    const totalPages = Math.ceil(RECIPES.length / this.recipesPerPage);
    this.pageIndicatorText.setText(`PAGE ${this.currentPage + 1} / ${totalPages}`);

    const itemW = 265;
    const itemH = 74;

    pageRecipes.forEach((recipe, idx) => {
      const y = idx * (itemH + 10);
      const itemContainer = scene.add.container(0, y);

      const bg = scene.add.graphics();
      const isSelected = recipe.id === this.selectedRecipe.id;
      const isUnlocked = registry.isUnlocked(recipe.id);

      this.drawItemBg(bg, itemW, itemH, isSelected, isUnlocked);
      itemContainer.add(bg);

      // Recipe Title
      const title = scene.add.text(12, 12, recipe.name, {
        fontFamily: THEME.fonts.title,
        fontSize: '14.5px',
        color: isSelected ? THEME.colors.creamHex : THEME.colors.teakWoodHex
      });
      itemContainer.add(title);

      // Tamil subtitle or tagline
      const subtitle = scene.add.text(12, 34, isUnlocked ? recipe.tamilName : `🔒 Unlock for ₹ ${recipe.unlockCostCoins}`, {
        fontFamily: THEME.fonts.body,
        fontSize: '11px',
        color: isSelected ? THEME.colors.turmericBrightHex : (isUnlocked ? THEME.colors.curryGreenHex : '#995544')
      });
      itemContainer.add(subtitle);

      // Prep Time / Level Badge
      const badgeText = isUnlocked ? `⏱ ${recipe.cookingTimeSec}s` : `LVL ${recipe.requiredLevel}`;
      const timeBadge = scene.add.text(itemW - 12, 14, badgeText, {
        fontFamily: THEME.fonts.body,
        fontSize: '10.5px',
        fontStyle: 'bold',
        color: isSelected ? THEME.colors.creamHex : THEME.colors.terracottaHex
      }).setOrigin(1, 0);
      itemContainer.add(timeBadge);

      // Difficulty Stars
      const diffStars = '★'.repeat(recipe.difficulty);
      const starText = scene.add.text(itemW - 12, 34, diffStars, {
        fontFamily: THEME.fonts.body,
        fontSize: '11px',
        color: isSelected ? THEME.colors.turmericBrightHex : THEME.colors.turmericGoldHex
      }).setOrigin(1, 0);
      itemContainer.add(starText);

      // Make clickable
      itemContainer.setSize(itemW, itemH);
      itemContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, itemW, itemH), Phaser.Geom.Rectangle.Contains);

      itemContainer.on('pointerdown', () => {
        SoundFX.getInstance().playPageTurn();
        this.selectedRecipe = recipe;
        this.renderRecipeList(scene);
        this.renderRecipeDetails(scene);
      });

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

      this.listContainer.add(itemContainer);
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
      g.lineStyle(1.5, unlocked ? THEME.colors.terracotta : 0xAA8877, 0.4);
      g.strokeRoundedRect(0, 0, w, h, 8);
    }
  }

  private renderRecipeDetails(scene: Phaser.Scene): void {
    this.detailsContainer.removeAll(true);
    const r = this.selectedRecipe;
    const registry = RecipeService.getInstance();
    const upgradeService = UpgradeService.getInstance();
    const isUnlocked = registry.isUnlocked(r.id);

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
        fontSize: '11px',
        fontStyle: 'bold',
        color: THEME.colors.turmericGoldHex
      }
    );
    this.detailsContainer.add(badgesText);

    // Description
    const desc = scene.add.text(0, 80, r.description, {
      fontFamily: THEME.fonts.body,
      fontSize: '11.5px',
      color: '#3A271B',
      wordWrap: { width: textW },
      lineSpacing: 3
    });
    this.detailsContainer.add(desc);

    // Dish Image (Right Top)
    const photoX = 575;
    const photoY = 68;
    const photoW = 270;
    const photoH = 185;

    const photoShadow = scene.add.graphics();
    photoShadow.fillStyle(0x000000, 0.4);
    photoShadow.fillRoundedRect(photoX - photoW / 2 + 4, photoY - photoH / 2 + 6, photoW, photoH, 10);
    this.detailsContainer.add(photoShadow);

    const photoKey = scene.textures.exists(r.imageKey) ? r.imageKey : 'photo_masala_dosa';
    const photoImg = scene.add.image(photoX, photoY, photoKey);
    photoImg.setDisplaySize(photoW, photoH);
    if (!isUnlocked) {
      photoImg.setTint(0x555555);
    }
    this.detailsContainer.add(photoImg);

    // Brass Border Frame
    const photoBorder = scene.add.graphics();
    photoBorder.lineStyle(3, THEME.colors.brass, 0.95);
    photoBorder.strokeRoundedRect(photoX - photoW / 2, photoY - photoH / 2, photoW, photoH, 10);
    this.detailsContainer.add(photoBorder);

    // If Locked, show Unlock Button Overlay on Photo
    if (!isUnlocked) {
      const lockOverlay = scene.add.container(photoX, photoY);
      const lBg = scene.add.graphics();
      lBg.fillStyle(0x000000, 0.65);
      lBg.fillRoundedRect(-120, -50, 240, 100, 10);
      lBg.lineStyle(2, THEME.colors.brassBright, 0.9);
      lBg.strokeRoundedRect(-120, -50, 240, 100, 10);
      lockOverlay.add(lBg);

      const lTxt = scene.add.text(0, -22, '🔒 RECIPE LOCKED', {
        fontFamily: THEME.fonts.title,
        fontSize: '15px',
        color: THEME.colors.turmericBrightHex
      }).setOrigin(0.5);
      lockOverlay.add(lTxt);

      const canAfford = upgradeService.getCoins() >= r.unlockCostCoins;
      const uBtn = scene.add.container(0, 16);
      const uBtnBg = scene.add.graphics();
      uBtnBg.fillStyle(canAfford ? THEME.colors.curryGreen : 0x777777, 1);
      uBtnBg.fillRoundedRect(-95, -14, 190, 28, 6);
      uBtn.add(uBtnBg);

      const uBtnTxt = scene.add.text(0, 0, canAfford ? `UNLOCK FOR ₹ ${r.unlockCostCoins}` : `NEED ₹ ${r.unlockCostCoins}`, {
        fontFamily: THEME.fonts.title,
        fontSize: '11px',
        color: THEME.colors.creamHex
      }).setOrigin(0.5);
      uBtn.add(uBtnTxt);

      if (canAfford) {
        uBtn.setSize(190, 28);
        uBtn.setInteractive({ useHandCursor: true });
        uBtn.on('pointerdown', () => {
          if (upgradeService.deductCoins(r.unlockCostCoins)) {
            registry.unlock(r.id);
            SoundFX.getInstance().playBell();
            this.renderRecipeList(scene);
            this.renderRecipeDetails(scene);
          }
        });
      }

      lockOverlay.add(uBtn);
      this.detailsContainer.add(lockOverlay);
    }

    // Essential Ingredients (2 columns)
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
        color: isUnlocked ? THEME.colors.teakWoodHex : '#888888'
      });
      this.detailsContainer.add(ingText);
    });

    // Preparation Stages (4-Stage Workflow)
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

      cardG.fillStyle(isUnlocked ? 0xF2E6D0 : 0xE5DAC7, 0.95);
      cardG.fillRoundedRect(cx, stagesY, cardW, cardH, 8);
      cardG.lineStyle(1.5, THEME.colors.brass, isUnlocked ? 0.6 : 0.3);
      cardG.strokeRoundedRect(cx, stagesY, cardW, cardH, 8);
      this.detailsContainer.add(cardG);

      const stageBadge = scene.add.text(cx + 8, stagesY + 8, `STAGE ${stage.stageNumber}`, {
        fontFamily: THEME.fonts.body,
        fontSize: '10px',
        fontStyle: 'bold',
        color: isUnlocked ? THEME.colors.terracottaHex : '#888888'
      });
      this.detailsContainer.add(stageBadge);

      const sTitle = scene.add.text(cx + 8, stagesY + 24, `${stage.icon} ${stage.title}`, {
        fontFamily: THEME.fonts.title,
        fontSize: '11px',
        color: isUnlocked ? THEME.colors.teakWoodHex : '#666666',
        wordWrap: { width: cardW - 16 }
      });
      this.detailsContainer.add(sTitle);

      const sDetail = scene.add.text(cx + 8, stagesY + 48, isUnlocked ? stage.detail : '🔒 Unlock recipe to view step technique.', {
        fontFamily: THEME.fonts.body,
        fontSize: '10px',
        color: isUnlocked ? '#3A271B' : '#777777',
        wordWrap: { width: cardW - 16 },
        lineSpacing: 2
      });
      this.detailsContainer.add(sDetail);

      const sTip = scene.add.text(cx + 8, stagesY + cardH - 32, isUnlocked ? `💡 Tip: ${stage.proTip}` : '💡 Pro tip hidden', {
        fontFamily: THEME.fonts.body,
        fontSize: '9.5px',
        fontStyle: 'italic',
        color: isUnlocked ? THEME.colors.curryGreenHex : '#888888',
        wordWrap: { width: cardW - 16 }
      });
      this.detailsContainer.add(sTip);
    });

    // Cultural Heritage Banner (Bottom)
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
