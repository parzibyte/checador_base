import Vue from 'vue'
import Router from 'vue-router'
import RegistrarRuta from '@/components/Rutas/RegistrarRuta'
import VerRutas from '@/components/Rutas/VerRutas'
import RegistrarUnidad from '@/components/Unidades/RegistrarUnidad'
import GestionarUnidades from '@/components/Unidades/GestionarUnidades'
import RegistrarRol from '@/components/Roles/RegistrarRol'
import VerRoles from '@/components/Roles/VerRoles'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/registrar-ruta',
            name: 'RegistrarRuta',
            component: RegistrarRuta
        },
        {
            path: '/rutas',
            name: 'VerRutas',
            component: VerRutas
        },

        {
            path: '/unidades',
            name: 'GestionarUnidades',
            component: GestionarUnidades
        },
        {
            path: '/registrar-unidad',
            name: 'RegistrarUnidad',
            component: RegistrarUnidad
        },
        {
            path: '/registrar-rol',
            name: 'RegistrarRol',
            component: RegistrarRol
        },
        {
            path: '/roles',
            name: 'VerRoles',
            component: VerRoles
        },
    ]
});