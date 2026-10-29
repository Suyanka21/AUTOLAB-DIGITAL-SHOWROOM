// Optional L4A WebGL prototype only; not imported by the showroom.
// ORM alpha is a linear quilt-thread coverage mask. Other channels retain glTF ORM.
export function attachThreadMask(primary,thread){
 if(!primary?.roughnessMap||!thread?.color)throw new Error('Thread mask requires primary ORM and the existing thread slot');
 const previous=primary.onBeforeCompile,previousKey=primary.customProgramCacheKey;
 primary.onBeforeCompile=function(shader,renderer){
  previous.call(this,shader,renderer);
  const marker='#include <map_fragment>';
  if(!shader.fragmentShader.includes(marker))throw new Error('Unsupported Three shader: map_fragment missing');
  shader.uniforms.l4ThreadColor={value:thread.color};
  shader.fragmentShader='uniform vec3 l4ThreadColor;\n'+shader.fragmentShader.replace(marker,marker+`
    #ifdef USE_ROUGHNESSMAP
      float l4Thread = texture2D( roughnessMap, vRoughnessMapUv ).a;
      diffuseColor.rgb = mix( diffuseColor.rgb, l4ThreadColor * 0.85, l4Thread );
    #endif
  `);
 };
 primary.customProgramCacheKey=()=>previousKey.call(primary)+'|autolab-l4a-thread-v1';primary.needsUpdate=true;
 return ()=>{primary.onBeforeCompile=previous;primary.customProgramCacheKey=previousKey;primary.needsUpdate=true;};
}
