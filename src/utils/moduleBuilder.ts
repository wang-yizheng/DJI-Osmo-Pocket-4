import * as THREE from 'three';
import {
  createPCBTexture,
  createBrushedMetalTexture,
  createLCDTexture,
  createBatteryTexture,
  createLensTexture,
  createHeatsinkTexture,
  createSpeakerTexture,
  createUSBCTexture,
  createHousingTexture,
} from './textures';

export interface ModuleInfo {
  name: string;
  nameEn: string;
  description: string;
  group: THREE.Group;
  basePosition: THREE.Vector3;
  explodedPosition: THREE.Vector3;
  color: string;
}

function createRoundedBoxGeometry(
  width: number,
  height: number,
  depth: number,
  radius: number
): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const w = width / 2 - radius;
  const h = height / 2 - radius;
  shape.moveTo(-w, -height / 2);
  shape.lineTo(w, -height / 2);
  shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -h);
  shape.lineTo(width / 2, h);
  shape.quadraticCurveTo(width / 2, height / 2, w, height / 2);
  shape.lineTo(-w, height / 2);
  shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, h);
  shape.lineTo(-width / 2, -h);
  shape.quadraticCurveTo(-width / 2, -height / 2, -w, -height / 2);

  const extrudeSettings = {
    depth: depth,
    bevelEnabled: true,
    bevelThickness: radius * 0.3,
    bevelSize: radius * 0.3,
    bevelSegments: 3,
  };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  return geo;
}

// Module 1: Gimbal Camera Module
function createGimbalCamera(): THREE.Group {
  const group = new THREE.Group();

  // Camera housing
  const housingGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.5, 32);
  const housingMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a2e,
    metalness: 0.7,
    roughness: 0.3,
  });
  const housing = new THREE.Mesh(housingGeo, housingMat);
  housing.rotation.x = Math.PI / 2;
  group.add(housing);

  // Lens
  const lensGeo = new THREE.CylinderGeometry(0.28, 0.3, 0.15, 32);
  const lensTex = createLensTexture();
  const lensMat = new THREE.MeshStandardMaterial({
    map: lensTex,
    metalness: 0.9,
    roughness: 0.1,
  });
  const lens = new THREE.Mesh(lensGeo, lensMat);
  lens.rotation.x = Math.PI / 2;
  lens.position.z = 0.3;
  group.add(lens);

  // Lens glass
  const glassGeo = new THREE.CircleGeometry(0.22, 32);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x001040,
    metalness: 0.1,
    roughness: 0.0,
    transmission: 0.6,
    thickness: 0.1,
    clearcoat: 1.0,
  });
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.z = 0.38;
  group.add(glass);

  // Gimbal arm
  const armGeo = new THREE.BoxGeometry(0.08, 0.5, 0.08);
  const armMat = new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0.8,
    roughness: 0.2,
  });
  const arm1 = new THREE.Mesh(armGeo, armMat);
  arm1.position.set(0.3, 0.1, 0);
  group.add(arm1);

  const arm2 = new THREE.Mesh(armGeo.clone(), armMat);
  arm2.position.set(-0.3, 0.1, 0);
  group.add(arm2);

  // Gimbal bracket
  const bracketGeo = new THREE.BoxGeometry(0.7, 0.08, 0.3);
  const bracket = new THREE.Mesh(bracketGeo, armMat);
  bracket.position.set(0, -0.2, 0);
  group.add(bracket);

  // Sensor (inside)
  const sensorGeo = new THREE.BoxGeometry(0.2, 0.15, 0.02);
  const sensorMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a3a,
    metalness: 0.5,
    roughness: 0.4,
    emissive: 0x000820,
  });
  const sensor = new THREE.Mesh(sensorGeo, sensorMat);
  sensor.position.z = 0.1;
  group.add(sensor);

  return group;
}

// Module 2: Main Body Housing
function createMainHousing(): THREE.Group {
  const group = new THREE.Group();
  const tex = createHousingTexture();

  const geo = createRoundedBoxGeometry(1.2, 3.2, 0.9, 0.15);
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    color: 0x2a2a2e,
    metalness: 0.3,
    roughness: 0.7,
  });
  const housing = new THREE.Mesh(geo, mat);
  group.add(housing);

  // Top mount
  const mountGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
  const mountMat = new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0.8,
    roughness: 0.2,
  });
  const mount = new THREE.Mesh(mountGeo, mountMat);
  mount.position.y = 1.65;
  group.add(mount);

  // Side buttons
  const btnGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16);
  const btnMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.6, roughness: 0.3 });
  for (let i = 0; i < 3; i++) {
    const btn = new THREE.Mesh(btnGeo, btnMat);
    btn.rotation.z = Math.PI / 2;
    btn.position.set(0.62, 0.5 - i * 0.3, 0);
    group.add(btn);
  }

  return group;
}

// Module 3: LCD Touchscreen
function createLCDScreen(): THREE.Group {
  const group = new THREE.Group();

  // Screen bezel
  const bezelGeo = new THREE.BoxGeometry(1.0, 1.2, 0.05);
  const bezelMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.5,
    roughness: 0.4,
  });
  const bezel = new THREE.Mesh(bezelGeo, bezelMat);
  group.add(bezel);

  // Screen display
  const screenGeo = new THREE.PlaneGeometry(0.85, 1.0);
  const screenTex = createLCDTexture();
  const screenMat = new THREE.MeshStandardMaterial({
    map: screenTex,
    emissive: 0x112233,
    emissiveIntensity: 0.5,
    metalness: 0.0,
    roughness: 0.1,
  });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.z = 0.026;
  group.add(screen);

  // Touch panel (transparent layer)
  const touchGeo = new THREE.PlaneGeometry(0.88, 1.05);
  const touchMat = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.1,
    metalness: 0.0,
    roughness: 0.0,
    clearcoat: 1.0,
  });
  const touch = new THREE.Mesh(touchGeo, touchMat);
  touch.position.z = 0.03;
  group.add(touch);

  // Flex cable
  const flexGeo = new THREE.BoxGeometry(0.15, 0.4, 0.01);
  const flexMat = new THREE.MeshStandardMaterial({ color: 0xcc8800, roughness: 0.8 });
  const flex = new THREE.Mesh(flexGeo, flexMat);
  flex.position.set(0, -0.8, 0);
  group.add(flex);

  return group;
}

// Module 4: Battery Module
function createBattery(): THREE.Group {
  const group = new THREE.Group();

  const tex = createBatteryTexture();
  const geo = new THREE.BoxGeometry(0.9, 1.8, 0.35);
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    color: 0x333333,
    metalness: 0.2,
    roughness: 0.6,
  });
  const battery = new THREE.Mesh(geo, mat);
  group.add(battery);

  // Battery connector
  const connGeo = new THREE.BoxGeometry(0.2, 0.1, 0.08);
  const connMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.8 });
  const conn = new THREE.Mesh(connGeo, connMat);
  conn.position.set(0, 0.95, 0);
  group.add(conn);

  // Warning label
  const labelGeo = new THREE.PlaneGeometry(0.5, 0.3);
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 128;
  labelCanvas.height = 64;
  const lctx = labelCanvas.getContext('2d')!;
  lctx.fillStyle = '#ffcc00';
  lctx.fillRect(0, 0, 128, 64);
  lctx.fillStyle = '#000';
  lctx.font = 'bold 12px sans-serif';
  lctx.fillText('⚠ LiPo', 10, 25);
  lctx.font = '8px sans-serif';
  lctx.fillText('Do not puncture', 10, 45);
  const labelTex = new THREE.CanvasTexture(labelCanvas);
  const labelMat = new THREE.MeshStandardMaterial({ map: labelTex });
  const label = new THREE.Mesh(labelGeo, labelMat);
  label.position.set(0, 0, 0.176);
  group.add(label);

  return group;
}

// Module 5: Main Board (PCB)
function createMainBoard(): THREE.Group {
  const group = new THREE.Group();

  const tex = createPCBTexture();
  const geo = new THREE.BoxGeometry(0.95, 2.6, 0.08);
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    metalness: 0.3,
    roughness: 0.6,
  });
  const board = new THREE.Mesh(geo, mat);
  group.add(board);

  // Main processor chip
  const chipGeo = new THREE.BoxGeometry(0.25, 0.25, 0.04);
  const chipMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.7,
    roughness: 0.3,
  });
  const chip = new THREE.Mesh(chipGeo, chipMat);
  chip.position.set(0, 0.3, 0.06);
  group.add(chip);

  // Chip label
  const chipLabelCanvas = document.createElement('canvas');
  chipLabelCanvas.width = 64;
  chipLabelCanvas.height = 64;
  const clctx = chipLabelCanvas.getContext('2d')!;
  clctx.fillStyle = '#222';
  clctx.fillRect(0, 0, 64, 64);
  clctx.fillStyle = '#aaa';
  clctx.font = '8px monospace';
  clctx.fillText('AMBARELLA', 4, 30);
  clctx.fillText('H22', 4, 45);
  const chipLabelTex = new THREE.CanvasTexture(chipLabelCanvas);
  const chipLabelMat = new THREE.MeshStandardMaterial({ map: chipLabelTex });
  const chipLabel = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.2), chipLabelMat);
  chipLabel.position.set(0, 0.3, 0.082);
  group.add(chipLabel);

  // Memory chip
  const memGeo = new THREE.BoxGeometry(0.15, 0.2, 0.03);
  const mem = new THREE.Mesh(memGeo, chipMat);
  mem.position.set(-0.25, -0.3, 0.055);
  group.add(mem);

  // Capacitors
  const capGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.05, 8);
  const capMat = new THREE.MeshStandardMaterial({ color: 0x886633, metalness: 0.5 });
  for (let i = 0; i < 8; i++) {
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(
      -0.3 + (i % 4) * 0.15,
      -0.8 + Math.floor(i / 4) * 0.15,
      0.065
    );
    group.add(cap);
  }

  // Connectors
  const connGeo = new THREE.BoxGeometry(0.12, 0.06, 0.04);
  const connMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.8 });
  for (let i = 0; i < 4; i++) {
    const conn = new THREE.Mesh(connGeo, connMat);
    conn.position.set(0.35, -0.5 + i * 0.3, 0.06);
    group.add(conn);
  }

  return group;
}

// Module 6: Stepper Motors (Gimbal Motors)
function createStepperMotors(): THREE.Group {
  const group = new THREE.Group();
  const metalTex = createBrushedMetalTexture();

  // 3 motors for 3-axis gimbal
  for (let i = 0; i < 3; i++) {
    const motorGroup = new THREE.Group();

    // Motor body
    const bodyGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.12, 24);
    const bodyMat = new THREE.MeshStandardMaterial({
      map: metalTex,
      color: 0x555555,
      metalness: 0.8,
      roughness: 0.2,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    motorGroup.add(body);

    // Motor shaft
    const shaftGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.2, 12);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9 });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.y = 0.15;
    motorGroup.add(shaft);

    // Coil windings (visible)
    const coilGeo = new THREE.TorusGeometry(0.1, 0.02, 8, 24);
    const coilMat = new THREE.MeshStandardMaterial({ color: 0xcc6600, metalness: 0.4 });
    const coil = new THREE.Mesh(coilGeo, coilMat);
    coil.rotation.x = Math.PI / 2;
    motorGroup.add(coil);

    // Encoder
    const encGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16);
    const encMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const enc = new THREE.Mesh(encGeo, encMat);
    enc.position.y = -0.08;
    motorGroup.add(enc);

    motorGroup.position.set(0, 0.8 - i * 0.4, 0);
    motorGroup.rotation.x = i * 0.3;
    group.add(motorGroup);
  }

  return group;
}

// Module 7: USB-C Port Module
function createUSBCPort(): THREE.Group {
  const group = new THREE.Group();

  // Port housing
  const tex = createUSBCTexture();
  const housingGeo = new THREE.BoxGeometry(0.4, 0.15, 0.25);
  const housingMat = new THREE.MeshStandardMaterial({
    map: tex,
    color: 0x444444,
    metalness: 0.7,
    roughness: 0.3,
  });
  const housing = new THREE.Mesh(housingGeo, housingMat);
  group.add(housing);

  // Port opening
  const portGeo = new THREE.BoxGeometry(0.25, 0.08, 0.15);
  const portMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const port = new THREE.Mesh(portGeo, portMat);
  port.position.z = 0.06;
  group.add(port);

  // USB-C tongue
  const tongueGeo = new THREE.BoxGeometry(0.18, 0.02, 0.1);
  const tongueMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const tongue = new THREE.Mesh(tongueGeo, tongueMat);
  tongue.position.z = 0.02;
  group.add(tongue);

  // Solder pads
  const padGeo = new THREE.BoxGeometry(0.02, 0.02, 0.01);
  const padMat = new THREE.MeshStandardMaterial({ color: 0xccaa44, metalness: 0.9 });
  for (let i = 0; i < 6; i++) {
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.set(-0.08 + i * 0.03, -0.06, -0.1);
    group.add(pad);
  }

  // Shielding can
  const shieldGeo = new THREE.BoxGeometry(0.35, 0.12, 0.18);
  const shieldMat = new THREE.MeshStandardMaterial({
    color: 0x666666,
    metalness: 0.9,
    roughness: 0.2,
  });
  const shield = new THREE.Mesh(shieldGeo, shieldMat);
  shield.position.z = -0.15;
  group.add(shield);

  return group;
}

// Module 8: Speaker/Microphone Module
function createSpeakerMic(): THREE.Group {
  const group = new THREE.Group();

  // Speaker unit
  const speakerGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 24);
  const speakerTex = createSpeakerTexture();
  const speakerMat = new THREE.MeshStandardMaterial({
    map: speakerTex,
    color: 0x333333,
    metalness: 0.3,
    roughness: 0.7,
  });
  const speaker = new THREE.Mesh(speakerGeo, speakerMat);
  speaker.rotation.x = Math.PI / 2;
  group.add(speaker);

  // Speaker cone
  const coneGeo = new THREE.ConeGeometry(0.15, 0.05, 24);
  const coneMat = new THREE.MeshStandardMaterial({
    color: 0x444444,
    roughness: 0.9,
  });
  const cone = new THREE.Mesh(coneGeo, coneMat);
  cone.rotation.x = -Math.PI / 2;
  cone.position.z = 0.05;
  group.add(cone);

  // Magnet
  const magnetGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16);
  const magnetMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8 });
  const magnet = new THREE.Mesh(magnetGeo, magnetMat);
  magnet.rotation.x = Math.PI / 2;
  magnet.position.z = -0.08;
  group.add(magnet);

  // Microphone (MEMS)
  const micGeo = new THREE.BoxGeometry(0.06, 0.06, 0.03);
  const micMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5 });
  const mic = new THREE.Mesh(micGeo, micMat);
  mic.position.set(0.3, 0, 0);
  group.add(mic);

  // Mic hole
  const micHoleGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.04, 8);
  const micHoleMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const micHole = new THREE.Mesh(micHoleGeo, micHoleMat);
  micHole.position.set(0.3, 0, 0.02);
  micHole.rotation.x = Math.PI / 2;
  group.add(micHole);

  // Second mic
  const mic2 = new THREE.Mesh(micGeo.clone(), micMat);
  mic2.position.set(-0.3, 0, 0);
  group.add(mic2);

  return group;
}

// Module 9: Heat Dissipation Module
function createHeatDissipation(): THREE.Group {
  const group = new THREE.Group();

  const tex = createHeatsinkTexture();

  // Heatsink base
  const baseGeo = new THREE.BoxGeometry(0.6, 0.6, 0.05);
  const baseMat = new THREE.MeshStandardMaterial({
    map: tex,
    color: 0x666666,
    metalness: 0.8,
    roughness: 0.3,
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  group.add(base);

  // Heat fins
  const finGeo = new THREE.BoxGeometry(0.55, 0.04, 0.3);
  const finMat = new THREE.MeshStandardMaterial({
    color: 0x555555,
    metalness: 0.9,
    roughness: 0.2,
  });
  for (let i = 0; i < 8; i++) {
    const fin = new THREE.Mesh(finGeo, finMat);
    fin.position.set(0, -0.25 + i * 0.07, 0.15);
    group.add(fin);
  }

  // Heat pipe
  const pipeGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 12);
  const pipeMat = new THREE.MeshStandardMaterial({
    color: 0xbb8833,
    metalness: 0.9,
    roughness: 0.1,
  });
  const pipe = new THREE.Mesh(pipeGeo, pipeMat);
  pipe.rotation.z = Math.PI / 2;
  pipe.position.set(0, 0, 0.05);
  group.add(pipe);

  // Thermal pad
  const padGeo = new THREE.BoxGeometry(0.3, 0.3, 0.02);
  const padMat = new THREE.MeshStandardMaterial({
    color: 0x4466aa,
    roughness: 0.9,
    transparent: true,
    opacity: 0.8,
  });
  const pad = new THREE.Mesh(padGeo, padMat);
  pad.position.set(0, 0, -0.035);
  group.add(pad);

  return group;
}

export function buildAllModules(): ModuleInfo[] {
  const modules: ModuleInfo[] = [
    {
      name: '云台相机模块',
      nameEn: 'Gimbal Camera',
      description: '1/1.3英寸CMOS传感器，支持4K/120fps视频录制，三轴机械增稳云台',
      group: createGimbalCamera(),
      basePosition: new THREE.Vector3(0, 2.2, 0),
      explodedPosition: new THREE.Vector3(0, 4.5, 1.5),
      color: '#4a9eff',
    },
    {
      name: '主机身外壳',
      nameEn: 'Main Housing',
      description: '高强度聚碳酸酯外壳，IP54防尘防水，重量仅约138g',
      group: createMainHousing(),
      basePosition: new THREE.Vector3(0, 0, 0),
      explodedPosition: new THREE.Vector3(2.5, 0, 0),
      color: '#888888',
    },
    {
      name: 'LCD触摸屏',
      nameEn: 'LCD Touchscreen',
      description: '2.0英寸OLED触摸屏，分辨率320×240，支持触控操作',
      group: createLCDScreen(),
      basePosition: new THREE.Vector3(0, -0.2, 0.5),
      explodedPosition: new THREE.Vector3(0, -0.2, 3.0),
      color: '#00cc66',
    },
    {
      name: '电池模块',
      nameEn: 'Battery Module',
      description: '内置1300mAh锂聚合物电池，续航约135分钟，支持快充',
      group: createBattery(),
      basePosition: new THREE.Vector3(0, -0.5, -0.15),
      explodedPosition: new THREE.Vector3(-2.5, -0.5, 0),
      color: '#ffaa00',
    },
    {
      name: '主控电路板',
      nameEn: 'Main PCB',
      description: 'Ambarella H22主控芯片，集成ISP图像处理，4GB LPDDR4内存',
      group: createMainBoard(),
      basePosition: new THREE.Vector3(0, 0.2, -0.1),
      explodedPosition: new THREE.Vector3(0, 0.2, -2.5),
      color: '#33cc33',
    },
    {
      name: '步进电机组',
      nameEn: 'Stepper Motors',
      description: '三轴无刷电机，响应速度<0.1s，控制精度±0.01°',
      group: createStepperMotors(),
      basePosition: new THREE.Vector3(0, 1.5, 0),
      explodedPosition: new THREE.Vector3(-2.5, 2.5, 1.5),
      color: '#ff6644',
    },
    {
      name: 'USB-C接口',
      nameEn: 'USB-C Port',
      description: 'USB 3.1 Gen1接口，支持数据传输和PD快充，最大18W',
      group: createUSBCPort(),
      basePosition: new THREE.Vector3(0, -1.6, 0),
      explodedPosition: new THREE.Vector3(2.5, -2.0, 0),
      color: '#cc44ff',
    },
    {
      name: '扬声器/麦克风',
      nameEn: 'Speaker & Mic',
      description: '双MEMS麦克风阵列，立体声扬声器，支持音频变焦',
      group: createSpeakerMic(),
      basePosition: new THREE.Vector3(0, -1.2, 0.3),
      explodedPosition: new THREE.Vector3(2.5, -1.2, 2.0),
      color: '#ff4488',
    },
    {
      name: '散热模块',
      nameEn: 'Heat Dissipation',
      description: '铜质热管+铝制散热鳍片，确保长时间录制不过热',
      group: createHeatDissipation(),
      basePosition: new THREE.Vector3(0, 0.5, -0.3),
      explodedPosition: new THREE.Vector3(-2.5, 0.5, -2.0),
      color: '#44dddd',
    },
  ];

  return modules;
}
