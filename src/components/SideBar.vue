<template>
    <aside
        :class="['flex h-screen flex-col overflow-y-auto border-r bg-white transition-all duration-300', isExpanded ? 'w-64 px-5 py-8' : 'w-20 items-center py-8 px-2']">
        <div :class="['flex items-center gap-x-3', isExpanded ? '' : 'justify-center']">
            <div class="bg-[#1C5E27] text-white p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-notepad-text-icon lucide-notepad-text">
                    <path d="M8 2v4" />
                    <path d="M12 2v4" />
                    <path d="M16 2v4" />
                    <rect width="16" height="18" x="4" y="4" rx="2" />
                    <path d="M8 10h6" />
                    <path d="M8 14h8" />
                    <path d="M8 18h5" />
                </svg>
            </div>
            <span v-show="isExpanded"
                class="text-xl font-bold text-gray-800 transition-opacity duration-200">RegisterAPI</span>
        </div>

        <div class="mt-10 flex flex-1 flex-col justify-between">
            <nav :class="['-mx-3 space-y-3', isExpanded ? '' : 'flex flex-col items-center']">
                <router-link v-for="item in menuItemsUser" :key="item.label" :to="item.to"
                    :class="['flex transform items-center rounded-lg px-3 py-3 text-gray-600 transition-colors duration-300 hover:bg-[#1C5E27] hover:text-white', isExpanded ? '' : 'justify-center']">
                    <component :is="item.icon" class="h-6 w-6" />
                    <span v-show="isExpanded" class="mx-4 text-base font-medium whitespace-nowrap">{{ item.label
                        }}</span>
                </router-link>
            </nav>

            <div class="mt-6 border-t pt-4">
                <div :class="['flex w-full items-center', isExpanded ? 'gap-x-3' : 'justify-center']">
                    <div v-show="isExpanded" class="flex flex-grow items-center justify-between">
                        <div class="transition-opacity duration-200">
                            <h1 class="text-base font-semibold text-gray-700 whitespace-nowrap">{{ usuario.nome }}</h1>
                            <p v-if=userAdm class="text-sm text-gray-500">Administrador</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { shallowRef } from 'vue';
import { User, GraduationCap, BookCheck, FileStack, UserPlus, Users     } from 'lucide-vue-next';

const userAdm = true

defineProps({
    isExpanded: {
        type: Boolean,
        required: true,
    }
});

const menuItemsUser = shallowRef([
    { to: "/userDashboard", label: 'Usuarios', icon: User },
    { to: "/courseDashboard", label: "Cursos e Disciplinas", icon: GraduationCap },
    { to: "/classroomDashboard", label: "Sala De aula", icon: Users },
    { to: "/allOfferings", label: "Ofertas", icon: FileStack  },
    { to: "/enrollment", label: "Alunos", icon: UserPlus  },
]);


const usuario = {
    nome: 'Admin'
};
</script>


<style scoped>
.router-link-exact-active {
    background-color: #1C5E27;
    color: white;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.router-link-exact-active:hover {
    background-color: #154b1f;
    color: white;
}
</style>