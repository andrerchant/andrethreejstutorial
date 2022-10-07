import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, startWith, tap } from 'rxjs/operators';
import * as THREE from 'three';
import { Camera, Clock, Renderer, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as InitialCF from '../config';

const { fov, aspect, near, far } = InitialCF.CAMERA_CF;

/**
 * Tutorial basic THREE usage
 * @link https://www.youtube.com/watch?v=xJAfLdUgdc4
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('webglStuff', { static: true }) webglEl!: ElementRef;
  renderer = new THREE.WebGLRenderer();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  ambientLight = new THREE.AmbientLight(0x333333);
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  spotlight = new THREE.SpotLight(0xffffff, 0.8);
  particlesCnt = 5000;
  posArray = new Float32Array(this.particlesCnt * 3);

  resize$ = fromEvent(window, 'resize').pipe(
    startWith(true),
    debounceTime(500),
    tap((e) => {
      this.resizeUpdate();
    })
  );

  constructor() {}

  resizeUpdate() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  start() {
    const orbit = new OrbitControls(this.camera, this.renderer.domElement);

    this.setDebugger();
    this.setScene(this.camera, orbit);
    this.webglEl.nativeElement.appendChild(this.renderer.domElement);
    this.createStuff();
  }

  setScene(camera: Camera, orbit: OrbitControls) {
    const { x, y, z } = InitialCF.cameraInital;
    camera.position.set(x, y, z);
    orbit.update();
    this.setLightning();
    this.renderer.shadowMap.enabled = true;
    this.renderer.setClearColor(new THREE.Color('#21282a'), 1);
  }

  setLightning() {
    this.scene.add(this.ambientLight);
    // this.scene.add(this.directionalLight);
    this.scene.add(this.spotlight);

    this.spotlight.position.set(-100, 100, 0);
    this.spotlight.castShadow = true;
    this.spotlight.angle = 0.2;

    this.directionalLight.position.set(-10, 20, 0);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.camera.bottom = -12;
  }

  setDebugger() {
    const axesHelper = new THREE.AxesHelper(InitialCF.AXES_LENGTH);
    const gridHelper = new THREE.GridHelper(30, 20);
    const spotLightHelper = new THREE.SpotLightHelper(this.spotlight);
    const dLightHelper = new THREE.DirectionalLightHelper(
      this.directionalLight,
      5
    );
    const dLisghtShadowHelper = new THREE.CameraHelper(
      this.directionalLight.shadow.camera
    );

    this.scene.add(axesHelper);
    this.scene.add(gridHelper);
    this.scene.add(spotLightHelper);
    // this.scene.add(dLightHelper);
    // this.scene.add(dLisghtShadowHelper);
  }

  createStuff() {
    const plane = this.createPlane(0xffffff);

    // const loader = new THREE.TextureLoader();
    // const cross = loader.load('./assets/img/crit.png');

    // const partcilesMat = new THREE.PointsMaterial({
    //   size: 1.5,
    //   map: cross,
    //   transparent: true,
    //   color: 'white',
    //   blending: THREE.AdditiveBlending,
    // });
    // const particlesGeometry = new THREE.BufferGeometry();

    // for (let i = 0; i < this.particlesCnt * 3; i++) {

    //   this.posArray[3 * i] = Math.random();
    //   this.posArray[3 * i + 1] = (Math.random() - 0.7) * (Math.random() * 50);
    //   this.posArray[3 * i + 2] = (Math.random() - 0.7) * (Math.random() * 50);

    //   //his.positions[3 * index] = x + spread * Math.cos(angle);
    //   // this.positions[3 * index + 1] = y + spread * Math.sin(angle);
    //   // this.positions[3 * index + 2] = AMBIENT.minimumZPosition * Math.random()
    // }

    // particlesGeometry.addAttribute(
    //   'position',
    //   new THREE.BufferAttribute(this.posArray, 3)
    // );

    //const particlesMesh = new THREE.Points(particlesGeometry, partcilesMat);

    const geometry = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    const vertices = new Float32Array([
      -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0,

      1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
    ]);

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);

    // scene.add(plane);
    this.scene.add(mesh);

    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;

    const animate = (time: number) => {
      this.renderParticles(time);
      this.renderer.render(this.scene, this.camera);
    };

    this.renderer.setAnimationLoop(animate);
  }

  renderParticles(time) {
    for (let i = 0; i < this.particlesCnt * 3; i++) {
      // this.posArray[3 * i] = Math.random();
      // this.posArray[3 * i + 1] = (Math.random() - 0.7) * (Math.random() * 50);
      // this.posArray[3 * i + 2] = (Math.random() - 0.7) * (Math.random() * 50);

      this.posArray[3 * i] = 45 * Math.cos(45);
      this.posArray[3 * i + 1] = 50 * Math.sin(45);
      this.posArray[3 * i + 2] = -100 * Math.random();
    }
  }

  createPlane(color: number) {
    const planeGeometry = new THREE.PlaneGeometry(30, 30);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
    });
    return new THREE.Mesh(planeGeometry, planeMaterial);
  }

  ngAfterViewInit() {
    this.start();
  }

  ngOnInit() {}
}
