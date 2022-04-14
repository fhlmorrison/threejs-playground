import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
 
async function loadGLTF(path) {
    const loader = new GLTFLoader();
  
    const fileData = await loader.loadAsync(path);
  
    console.log('Squaaawk!', fileData);
  
    const model = fileData.scene;
  
    return model
  }

export { loadGLTF }