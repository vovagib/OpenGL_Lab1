#version 330 core
out vec4 FragColor;

struct Material {
    sampler2D diffuse;
    sampler2D specular;    
    float shininess;
}; 

struct Light {
    vec3 position;
    vec3 direction;

    vec4 ambient;
    vec4 diffuse;
    vec4 specular;
};

in vec3 FragPos;  
in vec3 Normal;  
in vec2 TexCoords;

uniform vec3 viewPos;
uniform int id;
uniform Material material;
uniform Light light;

void main()
{
	vec4 result;
    // ambient
    vec4 ambient = light.ambient * texture2D(material.diffuse, TexCoords).rgba;

    // diffuse 
    vec3 norm = normalize(Normal);
    //vec3 lightDir = normalize(light.position - FragPos);
    vec3 lightDir = normalize(-light.direction);  
    float diff = max(dot(norm, lightDir), 0.0);
    float qq = texture2D(material.diffuse, TexCoords).a;
    vec4 diffuse = light.diffuse * diff * texture2D(material.diffuse, TexCoords).rgba;  

    // specular
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec4 specular = light.specular * spec * texture2D(material.specular, TexCoords).rgba;  
    if(id != 1)
    	result = ambient + diffuse + specular * 0.0;
    else
    	result = ambient + diffuse + specular * 8.0;
    
    if(qq < 0.5)
    	discard;
    else
    	FragColor = result;
    // if(!alpha)
    // 	FragColor = result;
    // else
    // 	discard;
    // 	//FragColor = vec4(result, 0.0);
} 