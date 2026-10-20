const fs =
    require(
        "node:fs/promises"
    );

const path =
    require(
        "node:path"
    );

const babel =
    require(
        "@babel/core"
    );

const moduloIstanbul =
    require(
        "babel-plugin-istanbul"
    );

const puppeteer =
    require(
        "puppeteer"
    );


const pluginIstanbul =
    moduloIstanbul.default ||
    moduloIstanbul;


function crearPluginCobertura() {

    return {

        name:
            "rectabags-coverage",


        setup(build) {

            build.onLoad(

                {
                    filter:
                        /\.(js|jsx)$/
                },


                async (
                    argumentos
                ) => {

                    const rutaNormalizada =
                        argumentos.path
                            .replace(
                                /\\/g,
                                "/"
                            );


                    const esCodigoFuente =
                        rutaNormalizada
                            .includes(
                                "/src/"
                            );


                    const esArchivoTest =
                        rutaNormalizada
                            .includes(
                                "/src/tests/"
                            );


                    if (
                        !esCodigoFuente ||
                        esArchivoTest
                    ) {

                        return null;

                    }


                    const esJsx =
                        argumentos.path
                            .endsWith(
                                ".jsx"
                            );


                    const codigoFuente =
                        await fs.readFile(
                            argumentos.path,
                            "utf8"
                        );


                    const resultado =
                        await babel
                            .transformAsync(
                                codigoFuente,
                                {

                                    filename:
                                        argumentos.path,

                                    babelrc:
                                        false,

                                    configFile:
                                        false,

                                    sourceMaps:
                                        "inline",

                                    sourceType:
                                        "module",

                                    parserOpts: {

                                        plugins:
                                            esJsx
                                                ? [
                                                    "jsx"
                                                ]
                                                : []

                                    },

                                    plugins: [

                                        [
                                            pluginIstanbul,
                                            {

                                                include: [
                                                    "src/**/*.js",
                                                    "src/**/*.jsx"
                                                ],

                                                exclude: [
                                                    "src/tests/**"
                                                ]

                                            }
                                        ]

                                    ]

                                }
                            );


                    return {

                        contents:
                            resultado.code,

                        loader:
                            esJsx
                                ? "jsx"
                                : "js",

                        resolveDir:
                            path.dirname(
                                argumentos.path
                            )

                    };

                }

            );

        }

    };

}


module.exports =
    async function (config) {

        process.env.CHROME_BIN =
            await puppeteer
                .executablePath();


        const coberturaActiva =
            process.env.COVERAGE ===
            "true";


        const pluginsEsbuild =
            coberturaActiva
                ? [
                    crearPluginCobertura()
                ]
                : [];


        config.set({

            basePath:
                "",


            frameworks: [
                "jasmine"
            ],


            files: [

                {
                    pattern:
                        "src/tests/**/*.spec.js",

                    watched:
                        true
                }

            ],


            preprocessors: {

                "src/tests/**/*.spec.js": [
                    "esbuild"
                ]

            },


            esbuild: {

                target:
                    "es2020",

                jsx:
                    "automatic",

                sourcemap:
                    "inline",

                singleBundle:
                    false,

                plugins:
                    pluginsEsbuild

            },


            reporters:
                coberturaActiva
                    ? [
                        "progress",
                        "coverage"
                    ]
                    : [
                        "progress"
                    ],


            coverageReporter: {

                dir:
                    "coverage",

                subdir:
                    ".",


                reporters: [

                    {
                        type:
                            "html",

                        subdir:
                            "html"
                    },

                    {
                        type:
                            "text-summary"
                    },

                    {
                        type:
                            "lcovonly",

                        subdir:
                            ".",

                        file:
                            "lcov.info"
                    }

                ]

            },


            browsers: [
                "ChromeHeadless"
            ],


            client: {

                jasmine: {

                    random:
                        false

                }

            },


            autoWatch:
                true,

            singleRun:
                true,

            restartOnFileChange:
                true

        });

    };