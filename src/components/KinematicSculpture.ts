import * as THREE from "three";

// Rigid links share joint centres: cursor motion changes angles, never link lengths.
export function createKinematicSculpture(group: THREE.Group) {
  const shell = new THREE.MeshStandardMaterial({
    metalness: 0.58,
    roughness: 0.32,
  });
  const rose = new THREE.MeshStandardMaterial({
    metalness: 0.72,
    roughness: 0.3,
  });
  const inset = new THREE.MeshStandardMaterial({
    color: "#352b32",
    metalness: 0.5,
    roughness: 0.42,
  });
  const outline = new THREE.LineBasicMaterial({
    transparent: true,
    opacity: 0.3,
  });
  const guide = new THREE.LineDashedMaterial({
    transparent: true,
    opacity: 0.26,
    dashSize: 0.08,
    gapSize: 0.07,
  });
  const radii = [0.55, 0.64, 0.5, 0.3];
  const lengths = [2.85, 2.65, 2.15];
  const geometries: THREE.BufferGeometry[] = [];
  const remember = <T extends THREE.BufferGeometry>(g: T) => {
    geometries.push(g);
    return g;
  };
  function mesh(
    g: THREE.BufferGeometry,
    m: THREE.Material,
    parent: THREE.Group,
  ) {
    const object = new THREE.Mesh(remember(g), m);
    parent.add(object);
    return object;
  }
  function cylinder(
    r: number,
    depth: number,
    m: THREE.Material,
    parent: THREE.Group,
  ) {
    const object = mesh(new THREE.CylinderGeometry(r, r, depth, 32), m, parent);
    object.rotation.x = Math.PI / 2;
    return object;
  }
  function edged(g: THREE.BufferGeometry, parent: THREE.Group) {
    const wire = new THREE.LineSegments(
      remember(new THREE.EdgesGeometry(g, 25)),
      outline,
    );
    parent.add(wire);
  }
  const joints = radii.map((radius, i) => {
    const pivot = new THREE.Group();
    group.add(pivot);
    const shape = new THREE.Shape();
    for (let n = 0; n <= 12; n++) {
      const a = (n / 12) * Math.PI * 2;
      if (!n) shape.moveTo(Math.cos(a) * radius, Math.sin(a) * radius);
      else shape.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
    }
    const hole = new THREE.Path();
    hole.absarc(0, 0, radius * 0.57, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const body = mesh(
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.24,
        steps: 1,
        bevelEnabled: true,
        bevelSize: 0.035,
        bevelThickness: 0.035,
        bevelSegments: 2,
        curveSegments: 32,
      }),
      shell,
      pivot,
    );
    body.position.z = -0.12;
    const edges = new THREE.Group();
    edges.position.z = -0.12;
    edged(body.geometry, edges);
    pivot.add(edges);
    cylinder(radius * 0.53, 0.31, inset, pivot);
    cylinder(radius * 0.39, 0.34, rose, pivot);
    cylinder(radius * 0.2, 0.36, shell, pivot);
    for (let k = 0; k < (i === 3 ? 3 : 6); k++) {
      const a = (k / (i === 3 ? 3 : 6)) * Math.PI * 2;
      const screw = cylinder(0.035, 0.02, inset, pivot);
      screw.position.set(
        Math.cos(a) * radius * 0.79,
        Math.sin(a) * radius * 0.79,
        0.17,
      );
    }
    return pivot;
  });
  const links = lengths.map((length) => {
    const link = new THREE.Group();
    group.add(link);
    const half = (length - 0.62) / 2,
      w = 0.23,
      c = 0.12;
    const shape = new THREE.Shape();
    shape.moveTo(-half + c, -w);
    shape.lineTo(half - c, -w);
    shape.lineTo(half, -w + c);
    shape.lineTo(half, w - c);
    shape.lineTo(half - c, w);
    shape.lineTo(-half + c, w);
    shape.lineTo(-half, w - c);
    shape.lineTo(-half, -w + c);
    shape.closePath();
    const hole = new THREE.Path();
    hole.moveTo(-half + 0.3, -0.085);
    hole.lineTo(-half + 0.3, 0.085);
    hole.lineTo(half - 0.3, 0.085);
    hole.lineTo(half - 0.3, -0.085);
    hole.closePath();
    shape.holes.push(hole);
    for (const z of [-0.2, 0.12]) {
      const rail = mesh(
        new THREE.ExtrudeGeometry(shape, {
          depth: 0.08,
          bevelEnabled: true,
          bevelSize: 0.035,
          bevelThickness: 0.025,
          bevelSegments: 2,
          steps: 1,
        }),
        shell,
        link,
      );
      rail.position.z = z;
      const edge = new THREE.Group();
      edge.position.z = z;
      edged(rail.geometry, edge);
      link.add(edge);
    }
    const spine = mesh(
      new THREE.BoxGeometry(length - 0.85, 0.08, 0.26),
      rose,
      link,
    );
    spine.position.y = -0.19;
    return link;
  });
  const tool = new THREE.Group();
  group.add(tool);
  mesh(new THREE.BoxGeometry(0.38, 0.3, 0.26), inset, tool).position.x = 0.26;
  for (const sign of [-1, 1]) {
    const finger = mesh(new THREE.BoxGeometry(0.48, 0.065, 0.17), rose, tool);
    finger.position.set(0.55, sign * 0.2, 0);
    mesh(new THREE.BoxGeometry(0.07, 0.14, 0.17), shell, tool).position.set(
      0.78,
      sign * 0.16,
      0,
    );
  }
  const arcs = [1, 2].map((index) => {
    const points = Array.from({ length: 73 }, (_, n) => {
      const angle = -0.4 + (n / 72) * Math.PI * 1.5;
      return new THREE.Vector3(
        Math.cos(angle) * (radii[index] + 0.33),
        Math.sin(angle) * (radii[index] + 0.33),
        -0.38,
      );
    });
    const arc = new THREE.Line(
      remember(new THREE.BufferGeometry().setFromPoints(points)),
      guide,
    );
    arc.computeLineDistances();
    group.add(arc);
    return { index, arc };
  });
  const points = radii.map(() => new THREE.Vector3());
  return {
    update(time: number, x: number, y: number) {
      points[0].set(-3.85, -0.25, 0);
      const angles = [0.42, -0.48, 0.35];
      for (let i = 0; i < lengths.length; i++) {
        const angle =
          angles[i] +
          Math.sin(time * 0.32 + i * 1.4) * 0.045 +
          x * 0.014 +
          y * (i === 1 ? -0.025 : 0.02);
        points[i + 1]
          .copy(points[i])
          .add(
            new THREE.Vector3(
              Math.cos(angle) * lengths[i],
              Math.sin(angle) * lengths[i],
              0,
            ),
          );
        links[i].position
          .copy(points[i])
          .add(points[i + 1])
          .multiplyScalar(0.5);
        links[i].rotation.z = angle;
        joints[i].rotation.z = angle * 0.3;
      }
      joints.forEach((joint, i) => joint.position.copy(points[i]));
      tool.position.copy(points[3]);
      tool.rotation.z = angles[2] + y * 0.02;
      arcs.forEach(({ index, arc }) => arc.position.copy(points[index]));
    },
    theme(accent: THREE.Color, ink: THREE.Color, light: boolean) {
      shell.color.set(light ? "#ded1c8" : "#cbb9b0");
      rose.color.copy(accent).lerp(new THREE.Color("#b98573"), 0.28);
      outline.color.copy(ink).lerp(accent, 0.55);
      guide.color.copy(accent);
    },
    dispose() {
      geometries.forEach((g) => g.dispose());
      [shell, rose, inset, outline, guide].forEach((m) => m.dispose());
    },
  };
}
