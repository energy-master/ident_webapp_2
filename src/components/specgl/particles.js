import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function Particles({ 
    xsize,
    ysize,
    zsize
}) {
    const meshRef = useRef();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Define your particle data (e.g., initial positions, speeds)
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 20000; i++) {
            const x = (Math.random() < 0.5) ? (Math.random() ) * xsize : (Math.random()) * xsize * -1
            const y = (Math.random() < 0.5) ? (Math.random()) * ysize : (Math.random()) * ysize * -1
            const z = (Math.random() < 0.5) ? (Math.random()) * zsize : (Math.random()) * zsize * -1
            temp.push({ position: new THREE.Vector3(x, y, z), speed: Math.random() * 0.1 + 0.11 });
        }
        return temp;
    }, []);

    useFrame(() => {
        particles.forEach((particle, i) => {
            // Update particle position based on speed and time
            
            
            Math.random() < 0.5 ? particle.position.y += particle.speed : particle.position.y -= particle.speed
            if (particle.position.y > ysize) particle.position.y = -1 * ysize; // Reset position
            if (particle.position.y < -1 * ysize) particle.position.y = ysize; // Reset position

            Math.random() < 0.5 ? particle.position.x += particle.speed : particle.position.x -= particle.speed
            if (particle.position.x > xsize) particle.position.x = -1 * xsize; // Reset position
            if (particle.position.x < -1 * xsize) particle.position.x = xsize; // Reset position

            // Math.random() < 0.5 ? particle.position.y += particle.speed : particle.position.y -= particle.speed
            // if (particle.position.y > 300) particle.position.y = -30; // Reset position
            // if (particle.position.y < -300) particle.position.y = +30; // Reset position


            dummy.position.copy(particle.position);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true; // Crucial for updating instanced meshes
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, particles.length]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="green" />
        </instancedMesh>
    );
}

export default Particles;