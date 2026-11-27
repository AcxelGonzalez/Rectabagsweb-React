function ProductFilter({categoria,onCategoriaChange,categorias = []}) {

    const opciones = [
        {
            valor: "todos",
            texto: "Todos"
        },
        ...categorias.map(item => ({ valor: String(item.idCategoria), texto: item.nombre }))
    ];


    return (

        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">

            {
                opciones.map((item) => (

                        <button key={item.valor} type="button" className={categoria === item.valor? "btn btn-dark": "btn btn-outline-dark"}
                            onClick={() =>onCategoriaChange(item.valor)}>
                            {item.texto}
                        </button>
                    )
                )
            }
        </div>
    );

}

export default ProductFilter;
