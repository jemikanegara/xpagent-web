import axios from 'axios'

const graphql = async (query, variables, fileVariable) => {
    // Set Options for Axios
    let options = {
        method: "post",
        url: process.env.VUE_APP_ENDPOINT,
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    }
    // Set data for Axios
    let data = {}

    if (fileVariable) {
        // 1. Create Copy of Files from variables
        const files = variables[fileVariable].slice()

        // 2. Create A form
        const form = new FormData();

        // 3. Change file in variable into null
        // EXPECTED : variables = { fileVar : [null, null] }
        // length of array depends of the numbers of files
        variables[fileVariable] = variables[fileVariable].map(() => null)

        // 4. Append 'operations' field to form
        const operations = {
            query,
            variables
        }
        form.append("operations", JSON.stringify(operations));

        // 5. Append 'map' field to form
        let map = {}
        files.forEach((file, i) => {
            map[i] = [`variables.${fileVariable}.${i}`];
        });
        form.append("map", JSON.stringify(map));

        // 6. Append files to form 
        // FORMAT EXAMPLE : {0: file.fileVariable.0}
        files.forEach((file, i) => {
            form.append(`${i}`, file, file.name);
        });

        for (var pair of form.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        // 7. Change request body 
        data = form

    } else {
        // 1. Add content type to headers
        options.headers['Content-Type'] = 'application/json'

        // 2. Assign query and variables to data
        data = {
            query,
            variables
        }
    }

    return await axios({
        ...options,
        data
    })
}

export default graphql