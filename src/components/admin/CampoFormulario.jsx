/*
 * Campo de formulario reutilizable: etiqueta + control + mensaje.

 * Props:
 * - etiqueta: texto visible del campo.
 * - nombre: atributo name (debe coincidir con la clave del formulario).
 * - valor, onChange, onBlur: conectan el campo con el estado del formulario.
 * - error: mensaje de error (si existe, el campo se marca en rojo).
 * - ayuda: texto de ayuda opcional (se muestra cuando no hay error).
 * - como: "input", "textarea" o "select".
 * - tipo: tipo del input ("text", "number", ...).
 */
function CampoFormulario({
    etiqueta,
    nombre,
    valor,
    onChange,
    onBlur,
    error,
    ayuda,
    como = "input",
    tipo = "text",
    children,
    ...resto
}) {

    const Elemento = como;

    const claseBase =
        como === "select"
            ? "form-select"
            : "form-control";

    return (

        <div>

            <label htmlFor={`campo-${nombre}`} className="form-label fw-semibold">
                {etiqueta}
            </label>

            <Elemento
                id={`campo-${nombre}`}
                name={nombre}
                className={`${claseBase} ${error ? "is-invalid" : ""}`}
                value={valor}
                onChange={onChange}
                onBlur={onBlur}
                type={como === "input" ? tipo : undefined}
                {...resto}
            >
                {children}
            </Elemento>

            {error ? (
                <div className="invalid-feedback">{error}</div>
            ) : (
                ayuda && <div className="form-text">{ayuda}</div>
            )}

        </div>

    );

}

export default CampoFormulario;