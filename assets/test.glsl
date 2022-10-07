// clang-format off
---
name: backgroundShader
type: fragment
uniform.color: { "type": "4fv", "value":[0,0,0,1]  }  
uniform.travelSpeed: { "type": "1f", "value":0.35 }
uniform.rotationSpeed: { "type": "1f", "value":0.1 }
uniform.zoom: { "type": "1f", "value": 1.7 }
uniform.brightness: { "type": "1f", "value":0.15 }
uniform.contrast: { "type": "1f", "value": 0.7 }
uniform.vignette: { "type": "1f", "value":0.4  }  
---
  // clang-format on

  precision mediump float;

uniform float time;
uniform float travelSpeed;
uniform float rotationSpeed;
uniform float zoom;
uniform float vignette;
uniform float brightness;
uniform float contrast;
uniform vec4 color;

uniform vec2 resolution;
varying vec2 fragCoord;

// clang-format off
#pragma glslify: blendColorDodge = require(glsl-blend/color-dodge)
// clang-format on

vec3 hash33(vec3 p) {
  float n = sin(dot(p, vec3(7, 157, 113)));
  return fract(vec3(2097152, 262144, 32768) * n);
}

// 3D Voronoi
float voronoi(vec3 p) {

  vec3 b, r, g = floor(p);
  p = fract(p);

  float d = 1.;

  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {

      b = vec3(i, j, -1);
      r = b - p + hash33(g + b);
      d = min(d, dot(r, r));

      b.z = 0.0;
      r = b - p + hash33(g + b);
      d = min(d, dot(r, r));

      b.z = 1.;
      r = b - p + hash33(g + b);
      d = min(d, dot(r, r));
    }
  }

  return d; // Range: [0, 1]
}

float noiseLayers(in vec3 p) {
  vec3 t = vec3(0., 0., p.z + time * travelSpeed);

  const int iter = 3;
  float tot = 0., sum = 0., amp = 1.;

  for (int i = 0; i < iter; i++) {
    tot += voronoi(p + t) * amp;
    p *= 2.;
    t *= 1.5;
    sum += amp;
    amp *= .5;
  }

  return tot / sum; // Range: [0, 1].
}

float brightnessContrast(float value, float brightness, float contrast) {
  return (value - 0.5) * contrast + 0.5 + brightness;
}

void main(void) {
  vec2 uv = (fragCoord - 0.5 * resolution) / resolution.y;

  vec3 ray = normalize(vec3(uv.x, uv.y, 3.1415926535898 / 8.));

  float cs = cos(time * rotationSpeed), si = sin(time * rotationSpeed);
  ray.xy = ray.xy * mat2(cs, -si, si, cs);

  float noise = noiseLayers(ray * zoom);
  noise = brightnessContrast(noise, brightness, contrast);

  float radial = max(
      (1. - vignette * 2. * length(uv * vec2(resolution.y / resolution.x, 1.))),
      0.);
  gl_FragColor = vec4(blendColorDodge(color.rgb, vec3(noise), radial), 1.);
}