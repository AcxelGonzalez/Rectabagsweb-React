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
    id: idPersonalizado,
    "aria-describedby": descripcionExterna,
    ...resto
}) {

    const Elemento = como;
    const id = idPersonalizado || `campo-${nombre}`;
    const idMensaje = error ? `${id}-error` : ayuda ? `${id}-ayuda` : undefined;
    const descripcion = [descripcionExterna, idMensaje].filter(Boolean).join(" ") || undefined;

    const claseBase =
        como === "select"
            ? "form-select"
            : "form-control";

    return (

        <div>

            <label htmlFor={id} className="form-label fw-semibold">
                {etiqueta}
            </label>

            <Elemento
                id={id}
                name={nombre}
                className={`${claseBase} ${error ? "is-invalid" : ""}`}
                value={valor}
                onChange={onChange}
                onBlur={onBlur}
                type={como === "input" ? tipo : undefined}
                {...resto}
                aria-invalid={error ? true : undefined}
                aria-describedby={descripcion}
            >
                {children}
            </Elemento>

            {error ? (
                <div id={idMensaje} className="invalid-feedback">{error}</div>
            ) : (
                ayuda && <div id={idMensaje} className="form-text">{ayuda}</div>
            )}

        </div>

    );

}

export default CampoFormulario;
