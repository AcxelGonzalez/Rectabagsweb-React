import {
    defineConfig,
    mergeConfig
} from "vitest/config";

import viteConfig
    from "./vite.config.js";


export default mergeConfig(

    viteConfig,

    defineConfig({

        test: {

            /*
             * Mantiene describe, it, expect, beforeEach,
             * vi, etc. disponibles globalmente.
             *
             * Esto evita tener que modificar los imports
             * de los 16 archivos de pruebas.
             */
            globals:
                true,


            /*
             * Simula el entorno del navegador.
             *
             * Necesario para:
             * document
             * window
             * localStorage
             * StorageEvent
             * MouseEvent
             */
            environment:
                "jsdom",


            /*
             * Evita problemas de localStorage asociados
             * a orígenes opacos de JSDOM.
             */
            environmentOptions: {

                jsdom: {

                    url:
                        "http://localhost:5173/"

                }

            },


            /*
             * Conservamos exactamente la ubicación actual
             * de las pruebas.
             */
            include: [
                "src/tests/**/*.spec.js"
            ],


            /*
             * Limpia el historial de mocks entre pruebas.
             */
            clearMocks:
                true,


            /*
             * Restaura automáticamente vi.spyOn().
             *
             * Esto se aproxima al comportamiento que
             * teníamos con los spies de Jasmine.
             */
            restoreMocks:
                true,


            /*
             * Mantiene un orden de hooks más predecible
             * durante la migración.
             */
            sequence: {

                hooks:
                    "list"

            },


            coverage: {

                provider:
                    "v8",

                reportsDirectory:
                    "coverage",

                reporter: [
                    "text-summary",
                    "html",
                    "lcov"
                ],

                include: [
                    "src/**/*.{js,jsx}"
                ],

                exclude: [
                    "src/tests/**"
                ]

            }

        }

    })

);