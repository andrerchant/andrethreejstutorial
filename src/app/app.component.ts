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
import { Camera, Renderer, Scene, WebGLRenderer } from 'three';
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

  resize$ = fromEvent(window, 'resize').pipe(
    startWith(true),
    debounceTime(500),
    tap((e) => {
      this.resizeUpdate();
    })
  );

  constructor() { }

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
    this.createStuff(this.renderer, this.camera, this.scene);
  }

  setScene(camera: Camera, orbit: OrbitControls) {
    const { x, y, z } = InitialCF.cameraInital;
    camera.position.set(x, y, z);
    orbit.update();
    this.setLightning();
    this.renderer.shadowMap.enabled = true;
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

  createStuff(renderer: WebGLRenderer, camera: Camera, scene: Scene) {
    const box = this.createBox(0x00ff00);
    const plane = this.createPlane(0xffffff);
    const sphere = this.createSphere(0x3b7eff);
    const torus = this.createTorus(0x2b7fff);

    scene.add(box);
    scene.add(plane);
    scene.add(sphere);
    scene.add(torus);

    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    sphere.position.set(-6, 4, 0);
    sphere.castShadow = true;
    box.position.y = 1;
    torus.position.set(6, 11, 2)
    torus.rotation.y = -1.4 * Math.PI;
    torus.rotation.x = 0.2 * Math.PI;

    const animate = function (time: number) {
      box.rotation.z = time / 1000;
      box.rotation.x = time / 1000;

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);
  }

  createBox(color: number) {
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshBasicMaterial({ color });
    return new THREE.Mesh(boxGeometry, boxMaterial);
  }

  createPlane(color: number) {
    const planeGeometry = new THREE.PlaneGeometry(30, 30);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
    });
    return new THREE.Mesh(planeGeometry, planeMaterial);
  }

  createSphere(color: number) {
    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color,
      shininess: 400,
      // reflectivity: 150,
      side: THREE.DoubleSide,
      wireframe: false,
    });
    return new THREE.Mesh(sphereGeometry, sphereMaterial);
  }

  createTorus(color: number) {
    const TorusGeometry = new THREE.TorusGeometry(4, 1, 5, 10);
    const torusMaterial = new THREE.PointsMaterial({
      color,
    })
    return new THREE.Mesh(TorusGeometry, torusMaterial);
  }

  ngAfterViewInit() {
    this.start();
  }

  ngOnInit() {
    /** //Original stuff
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    const animate = function () {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };
    camera.position.z = 5;
    renderer.render(scene, camera);
    animate();
    */
  }
}
