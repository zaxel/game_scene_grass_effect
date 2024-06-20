import { shaderURLs, shadersName } from "../../const/shadersPath";

export const shadersMap = new Map();

export async function loadShader() {
    const files = await Promise.all(shaderURLs.map(loadTextureFile));

    for (let i = 0; i < files.length; i += 2) {
        const shaderID = Math.floor(i / 2);
        const shaderName = shadersName[shaderID];
        shadersMap.set(shaderName + "_VS", files[i]);
        shadersMap.set(shaderName + "_FS", files[i + 1]);
    }
}

function loadTextureFile(url) {
    return fetch(url).then(response => response.text());
}

