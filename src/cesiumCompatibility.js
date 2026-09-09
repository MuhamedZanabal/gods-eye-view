function isIosWebKit(navigatorLike = {}) {
  const userAgent = String(navigatorLike.userAgent || '');
  const platform = String(navigatorLike.platform || '');
  const maxTouchPoints = Number(navigatorLike.maxTouchPoints || 0);

  const classicIos = /iPad|iPhone|iPod/i.test(`${userAgent} ${platform}`);
  const ipadDesktopMode = platform === 'MacIntel' && maxTouchPoints > 1;

  return classicIos || ipadDesktopMode;
}

/**
 * Build the Cesium context options for the current browser.
 *
 * WebKit on iPhone/iPad can lose a WebGL2 context during Cesium bootstrap and
 * then return null for capability queries such as ALIASED_LINE_WIDTH_RANGE.
 * Requesting Cesium's WebGL1 compatibility path avoids that startup failure on
 * iOS/iPadOS while leaving the normal WebGL2 default intact everywhere else.
 *
 * preserveDrawingBuffer is intentionally retained because recording/capture
 * flows depend on the existing framebuffer capture behaviour.
 */
export function buildCesiumContextOptions(navigatorLike = globalThis.navigator) {
  return {
    requestWebgl1: isIosWebKit(navigatorLike),
    webgl: {
      preserveDrawingBuffer: true,
    },
  };
}
