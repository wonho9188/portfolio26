import * as THREE from "three";
import { worldStops } from "../data/world";

export const landmarkPosition = (index: number) => {
  const stop = worldStops[index];
  const outward = new THREE.Vector3(stop.x, 0, stop.z)
    .normalize()
    .multiplyScalar(1.12);
  return new THREE.Vector3(stop.x + outward.x, 0, stop.z + outward.z);
};

export function createRoverScene(scene: THREE.Scene) {
  const shell = new THREE.MeshStandardMaterial({
    color: "#e7cdb9",
    metalness: 0.26,
    roughness: 0.4,
  });
  const rose = new THREE.MeshStandardMaterial({
    color: "#bb8196",
    metalness: 0.42,
    roughness: 0.36,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: "#3b3037",
    roughness: 0.5,
    metalness: 0.32,
  });
  const tire = new THREE.MeshStandardMaterial({
    color: "#332e30",
    roughness: 0.92,
  });
  const glass = new THREE.MeshStandardMaterial({
    color: "#59424f",
    metalness: 0.6,
    roughness: 0.25,
  });
  const ground = new THREE.MeshStandardMaterial({
    color: "#342a30",
    roughness: 0.94,
  });
  const road = new THREE.MeshStandardMaterial({
    color: "#483a40",
    roughness: 0.96,
  });
  const copper = new THREE.MeshStandardMaterial({
    color: "#bb8d70",
    metalness: 0.22,
    roughness: 0.6,
  });
  const light = new THREE.MeshStandardMaterial({
    color: "#ffe6c9",
    emissive: "#f2bd8f",
    emissiveIntensity: 0.25,
  });
  const guide = new THREE.LineDashedMaterial({
    color: "#c498ac",
    transparent: true,
    opacity: 0.6,
    dashSize: 0.13,
    gapSize: 0.18,
  });
  const trim = new THREE.LineBasicMaterial({
    color: "#a58192",
    transparent: true,
    opacity: 0.3,
  });
  const root = new THREE.Group();
  scene.add(root);
  const add = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    parent: THREE.Object3D,
    x = 0,
    y = 0,
    z = 0,
  ) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  };
  const slab = (
    w: number,
    d: number,
    h: number,
    material: THREE.Material,
    parent: THREE.Object3D,
    x = 0,
    y = 0,
    z = 0,
    radius = 0.1,
  ) => {
    const r = Math.min(radius, w / 3, d / 3);
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -d / 2);
    s.lineTo(w / 2 - r, -d / 2);
    s.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
    s.lineTo(w / 2, d / 2 - r);
    s.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2);
    s.lineTo(-w / 2 + r, d / 2);
    s.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r);
    s.lineTo(-w / 2, -d / 2 + r);
    s.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
    const geometry = new THREE.ExtrudeGeometry(s, {
      depth: h,
      bevelEnabled: true,
      bevelSize: 0.025,
      bevelThickness: 0.025,
      bevelSegments: 2,
      curveSegments: 5,
      steps: 1,
    });
    geometry.rotateX(-Math.PI / 2);
    return add(geometry, material, parent, x, y, z);
  };
  const cylinder = (
    radius: number,
    h: number,
    material: THREE.Material,
    parent: THREE.Object3D,
    x = 0,
    y = 0,
    z = 0,
    segments = 24,
  ) =>
    add(
      new THREE.CylinderGeometry(radius, radius, h, segments),
      material,
      parent,
      x,
      y,
      z,
    );
  const box = (
    w: number,
    h: number,
    d: number,
    material: THREE.Material,
    parent: THREE.Object3D,
    x = 0,
    y = 0,
    z = 0,
  ) => add(new THREE.BoxGeometry(w, h, d), material, parent, x, y, z);

  slab(19.4, 13.6, 0.3, ground, root, 0, -0.36, 0, 0.8);
  slab(19.15, 13.35, 0.07, ground, root, 0, -0.07, 0, 0.75);
  const grid = new THREE.GridHelper(18, 18, "#947084", "#755d6a");
  grid.position.y = 0.013;
  grid.scale.z = 0.7;
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.11;
  root.add(grid);
  const curve = new THREE.CatmullRomCurve3(
    worldStops.map((stop) => new THREE.Vector3(stop.x, 0.04, stop.z)),
    true,
    "centripetal",
  );
  const pathPoints = curve.getPoints(240);
  const positions: number[] = [],
    indices: number[] = [];
  for (let index = 0; index <= 240; index++) {
    const tangent = curve.getTangent(index / 240).normalize();
    const normal = new THREE.Vector3(tangent.z, 0, -tangent.x).multiplyScalar(
      0.47,
    );
    const p = pathPoints[index];
    positions.push(
      p.x + normal.x,
      0.028,
      p.z + normal.z,
      p.x - normal.x,
      0.028,
      p.z - normal.z,
    );
    if (index < 240) {
      const n = index * 2;
      indices.push(n, n + 2, n + 1, n + 1, n + 2, n + 3);
    }
  }
  const ribbon = new THREE.BufferGeometry();
  ribbon.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  ribbon.setIndex(indices);
  ribbon.computeVertexNormals();
  road.side = THREE.DoubleSide;
  add(ribbon, road, root);
  const route = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(
      pathPoints.map((p) => p.clone().setY(0.039)),
    ),
    guide,
  );
  route.computeLineDistances();
  root.add(route);
  for (const side of [-1, 1]) {
    const edge = pathPoints.map((p, index) => {
      const t = curve.getTangent(index / 240);
      return p
        .clone()
        .add(new THREE.Vector3(t.z, 0, -t.x).multiplyScalar(0.47 * side))
        .setY(0.038);
    });
    root.add(
      new THREE.Line(new THREE.BufferGeometry().setFromPoints(edge), trim),
    );
  }
  const beacons: THREE.Mesh[] = [];
  worldStops.forEach((stop, index) => {
    const p = landmarkPosition(index);
    const site = new THREE.Group();
    site.position.copy(p);
    site.rotation.y = Math.atan2(-p.x, -p.z);
    root.add(site);
    slab(1.8, 1.45, 0.1, shell, site, 0, 0.02, 0, 0.18);
    slab(1.64, 1.3, 0.05, ground, site, 0, 0.13, 0, 0.14);
    const beacon = cylinder(0.14, 0.055, rose, root, stop.x, 0.06, stop.z);
    beacons.push(beacon);
    switch (stop.shape) {
      case "studio":
        slab(1.3, 0.83, 0.85, shell, site, 0, 0.18, -0.1);
        slab(1.42, 0.95, 0.09, copper, site, 0, 1.04, -0.1);
        box(1.07, 0.5, 0.035, glass, site, 0, 0.72, 0.34);
        for (let n = 0; n < 3; n++)
          box(0.22, 0.035, 0.02, rose, site, -0.3 + n * 0.3, 0.68, 0.365);
        box(0.63, 0.035, 0.02, shell, site, 0, 0.84, 0.365);
        break;
      case "arm": {
        for (const offset of [-0.45, 0.45]) {
          cylinder(0.25, 0.15, copper, site, offset, 0.26, 0);
          const links = [
            new THREE.Vector3(offset, 0.35, 0),
            new THREE.Vector3(offset - 0.2, 0.83, 0),
            new THREE.Vector3(offset + 0.1, 1.13, 0.06),
          ];
          for (let n = 0; n < 2; n++) {
            const delta = links[n + 1].clone().sub(links[n]);
            const link = box(0.13, delta.length(), 0.15, shell, site);
            link.position.copy(
              links[n]
                .clone()
                .add(links[n + 1])
                .multiplyScalar(0.5),
            );
            link.quaternion.setFromUnitVectors(
              new THREE.Vector3(0, 1, 0),
              delta.normalize(),
            );
            add(
              new THREE.SphereGeometry(0.13, 12, 8),
              rose,
              site,
              links[n].x,
              links[n].y,
              links[n].z,
            );
          }
          box(0.24, 0.06, 0.15, dark, site, offset + 0.1, 1.15, 0.06);
        }
        break;
      }
      case "maze":
        for (const [x, z, w, d] of [
          [-0.65, 0, 0.08, 1.04],
          [0.65, 0, 0.08, 1.04],
          [0, -0.5, 1.3, 0.08],
          [-0.25, 0.08, 0.08, 0.7],
          [0.2, 0.12, 0.8, 0.08],
          [0.35, -0.2, 0.08, 0.55],
        ])
          box(w, 0.28, d, shell, site, x, 0.34, z);
        slab(0.36, 0.43, 0.17, rose, site, 0.34, 0.19, 0.36, 0.08);
        cylinder(0.07, 0.07, dark, site, 0.34, 0.43, 0.36);
        break;
      case "parcel":
        for (const [x, y, z] of [
          [-0.4, 0.2, 0.1],
          [0.18, 0.2, 0.15],
          [-0.12, 0.74, -0.2],
        ]) {
          slab(0.52, 0.5, 0.48, copper, site, x, y, z, 0.045);
          box(0.08, 0.49, 0.51, shell, site, x, y + 0.24, z);
        }
        break;
      case "hospital":
        slab(1.2, 0.88, 1.23, shell, site, 0, 0.18, -0.1);
        slab(1.35, 1, 0.08, copper, site, 0, 1.4, -0.1);
        for (let n = 0; n < 3; n++)
          box(0.18, 0.2, 0.025, glass, site, -0.35 + n * 0.35, 0.53, 0.36);
        box(0.12, 0.42, 0.03, rose, site, 0, 1.08, 0.36);
        box(0.42, 0.12, 0.03, rose, site, 0, 1.08, 0.365);
        break;
      case "profile": {
        cylinder(0.5, 0.13, copper, site, 0, 0.23, 0);
        const ring = add(
          new THREE.TorusGeometry(0.43, 0.09, 10, 32),
          shell,
          site,
          0,
          0.85,
          0,
        );
        ring.rotation.y = 0.15;
        add(new THREE.SphereGeometry(0.23, 20, 12), rose, site, 0, 0.85, 0);
        break;
      }
      case "notes":
        for (let n = 0; n < 3; n++) {
          const book = slab(
            0.3,
            0.85,
            0.82 + n * 0.08,
            n === 1 ? rose : shell,
            site,
            -0.4 + n * 0.37,
            0.2,
            0,
            0.035,
          );
          book.rotation.z = (n - 1) * -0.1;
          box(0.18, 0.04, 0.02, copper, site, -0.4 + n * 0.37, 0.7, 0.44);
        }
        break;
      case "garden":
        for (const x of [-0.42, 0.35]) {
          cylinder(0.045, 0.5, copper, site, x, 0.43, -0.2);
          add(
            new THREE.SphereGeometry(0.29, 14, 10),
            x < 0 ? rose : shell,
            site,
            x,
            0.85,
            -0.2,
          );
        }
        slab(0.88, 0.33, 0.1, copper, site, 0, 0.4, 0.4);
        box(0.07, 0.22, 0.25, dark, site, -0.3, 0.27, 0.4);
        box(0.07, 0.22, 0.25, dark, site, 0.3, 0.27, 0.4);
    }
  });
  // A wheel-driven AMR: four tires, bumper, front lights, and a roof lidar.
  const rover = new THREE.Group();
  root.add(rover);
  slab(1.25, 1.65, 0.15, dark, rover, 0, 0.23);
  slab(1.15, 1.53, 0.35, shell, rover, 0, 0.39, 0, 0.19);
  slab(0.93, 1.18, 0.045, rose, rover, 0, 0.76, -0.06, 0.14);
  const wheels: THREE.Group[] = [];
  for (const x of [-0.64, 0.64])
    for (const z of [-0.51, 0.51]) {
      const wheel = new THREE.Group();
      wheel.position.set(x, 0.28, z);
      rover.add(wheel);
      wheels.push(wheel);
      const rubber = cylinder(0.255, 0.17, tire, wheel);
      rubber.rotation.z = Math.PI / 2;
      const hub = cylinder(0.16, 0.182, copper, wheel);
      hub.rotation.z = Math.PI / 2;
      const cap = cylinder(0.075, 0.19, rose, wheel);
      cap.rotation.z = Math.PI / 2;
      for (let n = 0; n < 4; n++)
        add(
          new THREE.SphereGeometry(0.025, 6, 5),
          shell,
          wheel,
          x < 0 ? -0.1 : 0.1,
          0.12 * Math.cos((n * Math.PI) / 2),
          0.12 * Math.sin((n * Math.PI) / 2),
        );
    }
  box(0.9, 0.14, 0.09, dark, rover, 0, 0.44, 0.81);
  for (const x of [-0.36, 0.36])
    box(0.15, 0.08, 0.04, light, rover, x, 0.61, 0.787);
  cylinder(0.085, 0.3, dark, rover, 0, 0.96, -0.05);
  cylinder(0.26, 0.14, dark, rover, 0, 1.15, -0.05);
  cylinder(0.27, 0.045, shell, rover, 0, 1.24, -0.05);
  cylinder(0.265, 0.025, rose, rover, 0, 1.14, -0.05);
  cylinder(0.014, 0.28, dark, rover, -0.33, 0.96, -0.42, 8);
  add(new THREE.SphereGeometry(0.035, 8, 6), rose, rover, -0.33, 1.12, -0.42);
  const halo = add(
    new THREE.RingGeometry(0.8, 0.85, 48),
    new THREE.MeshBasicMaterial({
      color: "#d39db6",
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    }),
    rover,
    0,
    0.02,
    0,
  );
  halo.rotation.x = -Math.PI / 2;
  const targetRotation = new THREE.Quaternion();
  return {
    curve,
    rover,
    update(
      progress: number,
      direction: number,
      distance: number,
      dt: number,
      selected: number,
    ) {
      rover.position.copy(curve.getPoint(progress)).setY(0.045);
      const heading = curve.getTangent(progress).multiplyScalar(direction);
      targetRotation.setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        Math.atan2(heading.x, heading.z),
      );
      rover.quaternion.slerp(targetRotation, Math.min(1, dt * 10));
      wheels.forEach((wheel) => {
        wheel.rotation.x += (distance / 0.255) * direction;
      });
      beacons.forEach((beacon, index) => {
        beacon.scale.setScalar(index === selected ? 1.3 : 1);
      });
    },
    theme(accent: string, lightMode: boolean) {
      rose.color.set(accent);
      ground.color.set(lightMode ? "#e3d5c8" : "#342a30");
      road.color.set(lightMode ? "#cbb7aa" : "#483a40");
      shell.color.set(lightMode ? "#f2e4d5" : "#dfc2ac");
      guide.color.set(accent);
      trim.color.set(accent);
    },
    dispose() {
      const geometries = new Set<THREE.BufferGeometry>(),
        materials = new Set<THREE.Material>();
      root.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) geometries.add(mesh.geometry);
        if (mesh.material)
          (Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material]
          ).forEach((material) => materials.add(material));
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      root.removeFromParent();
    },
  };
}
