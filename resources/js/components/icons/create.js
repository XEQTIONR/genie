import * as react from 'react'


const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();


var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

const Icon = react.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => {
    return react.createElement(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => react.createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);

const createLucideIcon = (iconName, iconNode) => {
  const Component = react.forwardRef(
    ({ className, ...props }, ref) => react.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
      ...props
    })
  );
  Component.displayName = `${iconName}`;
  return Component;
};

const __iconNode$godot = [
    ["path", { d: "m 5.09002,10.636004 -1.003251,-1.473213 1.464279,-1.861728 1.451805,0.816711 1.481916,-1.105197 -0.100647,-1.799466 2.132583,-0.750291 0.839535,1.579446 1.689456,-0.0083 0.788694,-1.552482 2.140881,0.735771 -0.12639,1.769355 1.490214,1.112478 1.491249,-0.802179 1.445577,1.883511 -0.982755,1.424835 -9.6e-5,5.643465 c -0.545253,4.89123 -14.396417,4.58587 -14.224907,-0.27695 z", key: "p1my2t" }],
    ["path", { d: "m 5.104414,14.80 2.552195,0.30263 0.161404,1.42237 2.713598,0.18158 0.272368,-1.28114 2.743861,-0.0101 0.232018,1.26097 2.723685,-0.15132 0.13114,-1.38202 2.602633,-0.30263", key: "p1my2u" }],
    ["path", { d: "m 12.197943,12.50 v 1.0", key: "p1my2u" }],
    ["circle", { cx: "9.197943", cy: "11.75", r: "1", key: "4ej97u" }],
    ["circle", { cx: "15.197943", cy: "11.75", r: "1", key: "4ej97r" }],
]

const __iconNode$unity = [
    ["path", { d: "M4 13L13.5 13M4 13L8 17.5M4 13L8 8.5M13.5 13L18.5 4M13.5 13L18.5 20M18.5 4L12.5 5M18.5 4L20 9.5M18.5 20L20 14.5M18.5 20L12.5 19.5", key: "p1my2r" }],
]
const __iconNode$unreal = [
    ["path", { d: "M 0.8919074,14.809091 c 3.26535,-5.61267 5.95312,-5.01717 5.95312,-5.01717 v 8.60148 l -1.06895,0.18768 c 0,0 1.8367196,3.45081 7.0129396,3.50647 l 2.28668,-2.41264 2.11031,1.74474 c 0,0 4.17437,-2.50462 5.56583,-6.01109 -1.66056,1.98715 -4.17437,1.61409 -4.17437,1.61409 v -9.23926 c 0,0 0.70231,-2.10127 2.84607,-3.83666 -3.41101,0.49246 -6.07425,2.9461303 -6.07425,2.9461303 l -1.83672,-0.27829 1.05751,1.8923797 v 8.01478 c 0,0 -2.44892,2.89423 -3.72906,0.38961 v -9.55686 c -0.46398,0.24816 -2.79071,-1.40743 0.70163,-4.34313 0,0 -9.3521316,2.38269 -10.6507596,11.79774 z", key: "p1my2t" }],
]


const Godot = createLucideIcon("Godot", __iconNode$godot)
const Unity = createLucideIcon("Unity", __iconNode$unity)
const Unreal = createLucideIcon("Unreal", __iconNode$unreal)
export  {
    Godot,
    Unity,
    Unreal,
}