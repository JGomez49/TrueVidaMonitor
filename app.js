const xls = require('xlsx');

function leerExcel(ruta){
    const libro = xls.readFile(ruta);
    const hojas = libro.SheetNames;

    console.log(hojas);

    const hoja = hojas[0];

    const data = xls.utils.sheet_to_json(libro.Sheets[hoja]);

    console.log(data);

    data.forEach(e => {
        console.log(e.Nombre);
    });
}

leerExcel('Book1.xlsx');

