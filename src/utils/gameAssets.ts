/**
 * Preloaded high-resolution image assets for Lord Ganesha Murti and Mushak Devotee Figurine.
 * Modeled directly on the user-provided reference photographs.
 */

let ganeshaImage: HTMLImageElement | null = null;
let mushakImage: HTMLImageElement | null = null;

export function getGaneshaImage(): HTMLImageElement {
  if (!ganeshaImage) {
    ganeshaImage = new Image();
    ganeshaImage.src = '/images/ganesha.svg';
  }
  return ganeshaImage;
}

export function getMushakImage(): HTMLImageElement {
  if (!mushakImage) {
    mushakImage = new Image();
    mushakImage.src = '/images/mushak.svg';
  }
  return mushakImage;
}

/**
 * Draws Lord Ganesha image on canvas with graceful fallback
 */
export function drawGaneshaAsset(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  width: number,
  height: number
) {
  const img = getGaneshaImage();
  if (img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, cx - width / 2, cy - height, width, height);
    return true;
  }
  return false;
}

/**
 * Draws Mushak image on canvas with graceful fallback
 */
export function drawMushakAsset(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  width: number,
  height: number
) {
  const img = getMushakImage();
  if (img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, cx - width / 2, cy - height / 2, width, height);
    return true;
  }
  return false;
}
