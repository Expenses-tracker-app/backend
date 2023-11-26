import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routesPath = path.join(__dirname, '../routes');
const routeFiles = fs.readdirSync(routesPath);

const methodToAction = {
  get: 'get',
  post: 'create',
  put: 'update',
  delete: 'delete'
};

const getRoutes = () => {
  const routes = [];
  routeFiles.forEach((file) => {
    const filePath = path.join(routesPath, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const resourceName = file.replace('Routes.js', ''); // Assuming the file is named like 'userRoutes.js'

    const regex = /router\.(get|post|put|delete)\(['"`](.*?)['"`]/g;
    let match;

    while ((match = regex.exec(fileContents)) !== null) {
      const category = resourceName;
      const method = match[1];
      const path = match[2];
      const action = methodToAction[method];
      const all = path === '/' && category === 'tag' ? 'All' : '';
      const name = `${action}${all}${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}`;

      routes.push({ name, category, path, method });
    }
  });
  return routes;
};

const generateServiceFunctions = (routes) => {
  let functions = '';

  routes.forEach((route) => {
    let functionName = route.name;
    if (route.path === '/login') functionName = 'login';
    if (route.path === '/logout') functionName = 'logout';

    functions += `
export async function ${functionName}(data) {
  try {
    const response = await fetch(\`\${API_URL}/${route.category}${route.path}\`, {
      method: '${route.method.toUpperCase()}',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (responseData.error) {
      throw new Error(responseData.error);
    }

    return { status: response.status, ...responseData };
  } catch (err) {
    console.error(err.message);
    throw new Error('Server error');
  }
}
`;
  });

  return functions;
};

const routes = getRoutes();
console.log(routes);

const apiServiceContent = `/*
This is a generated file. Do not edit it directly!
To change the contents of this file, edit api/apiServiceGenerator.js instead.
*/

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
${generateServiceFunctions(routes)}`;

fs.writeFileSync(path.join(__dirname, 'apiService.js'), apiServiceContent);
