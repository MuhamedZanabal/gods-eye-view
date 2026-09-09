import test from 'node:test';
import assert from 'node:assert/strict';

let compatibility = {};
try {
  compatibility = await import('./cesiumCompatibility.js');
} catch {
  // RED phase: the compatibility policy does not exist yet.
}

const iphoneSafari = {
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7_2 like Mac OS X) AppleWebKit/605.1.15 Version/18.7 Mobile/15E148 Safari/604.1',
  platform: 'iPhone',
  maxTouchPoints: 5,
};

const ipadDesktopUa = {
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15',
  platform: 'MacIntel',
  maxTouchPoints: 5,
};

const desktopSafari = {
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15',
  platform: 'MacIntel',
  maxTouchPoints: 0,
};

const androidChrome = {
  userAgent: 'Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/140.0 Mobile Safari/537.36',
  platform: 'Linux armv8l',
  maxTouchPoints: 5,
};

test('iOS WebKit requests Cesium WebGL1 compatibility mode', () => {
  assert.equal(typeof compatibility.buildCesiumContextOptions, 'function');
  assert.equal(compatibility.buildCesiumContextOptions(iphoneSafari).requestWebgl1, true);
  assert.equal(compatibility.buildCesiumContextOptions(ipadDesktopUa).requestWebgl1, true);
});

test('non-iOS browsers keep Cesium WebGL2 default', () => {
  assert.equal(typeof compatibility.buildCesiumContextOptions, 'function');
  assert.equal(compatibility.buildCesiumContextOptions(desktopSafari).requestWebgl1, false);
  assert.equal(compatibility.buildCesiumContextOptions(androidChrome).requestWebgl1, false);
});

test('compatibility mode preserves the existing capture buffer requirement', () => {
  assert.equal(typeof compatibility.buildCesiumContextOptions, 'function');
  assert.deepEqual(compatibility.buildCesiumContextOptions(iphoneSafari).webgl, {
    preserveDrawingBuffer: true,
  });
});
