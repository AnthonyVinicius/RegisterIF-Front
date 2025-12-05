<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import SubjectDAO from "../service/SubjectDAO";
import CourseDAO from "../service/CourseDAO";
import BaseLayout from "../components/BaseLayout.vue";

const route = useRoute();
const courseId = route.params.id;

const course = ref(null);
const linkedSubjects = ref([]);
const allSubjects = ref([]);
const showAllSubjects = ref(false);

async function loadLinkedSubjects() {
    try {
        linkedSubjects.value = await SubjectDAO.getByCourse(courseId);
    } catch (error) {
        console.error("Erro ao carregar disciplinas vinculadas:", error);
    }
}

async function loadAllSubjects() {
    try {
        allSubjects.value = await SubjectDAO.getAll();
    } catch (error) {
        console.error("Erro ao carregar todas as disciplinas:", error);
    }
}

function toggleAttachSection() {
    showAllSubjects.value = !showAllSubjects.value;
    if (showAllSubjects.value) {
        loadAllSubjects();
    }
}

async function attachSubject(subject) {
    try {
        await SubjectDAO.update(subject.id, {
            courses: [courseId]
        });

        alert("Disciplina vinculada com sucesso!");
        await loadLinkedSubjects();
        showAllSubjects.value = false;

    } catch (error) {
        alert("Erro ao vincular disciplina.");
        console.error(error);
    }
}


onMounted(async () => {
    course.value = await CourseDAO.getById(courseId);
    await loadLinkedSubjects();
});
</script>

<template>
    <BaseLayout>
        <div class="space-y-8 px-6">

            <header class="flex justify-between items-center border-b pb-5">
                <h1 class="text-2xl font-bold text-[#1C5E27]">
                    Disciplinas vinculadas: {{ course?.name }}
                </h1>

                <button @click="toggleAttachSection"
                    class="bg-[#1C5E27] hover:bg-[#174a20] text-white font-semibold py-2 px-5 rounded-md shadow-sm transition">
                    {{ showAllSubjects ? "Fechar" : "Vincular Disciplina" }}
                </button>
            </header>

            <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="subject in linkedSubjects" :key="subject.id"
                    class="p-5 bg-green-50 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition">
                    <h2 class="text-lg font-semibold text-[#1C5E27] mb-1">{{ subject.name }}</h2>
                    <p class="text-xs text-gray-500">{{ subject.code }}</p>
                </div>

                <div v-if="linkedSubjects.length === 0" class="flex justify-center py-10 text-gray-500 col-span-full">
                    Nenhuma disciplina vinculada ainda.
                </div>
            </section>

            <section v-if="showAllSubjects" class="space-y-5 border-t pt-5">
                <h2 class="text-lg font-semibold text-[#1C5E27]">
                    Selecione para vincular
                </h2>

                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div v-for="subject in allSubjects" :key="subject.id"
                        class="p-5 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition">
                        <h3 class="text-lg font-semibold text-[#1C5E27] mb-1">
                            {{ subject.name }}
                        </h3>
                        <p class="text-xs text-gray-500">{{ subject.code }}</p>

                        <button @click="attachSubject(subject)"
                            class="w-full mt-3 py-2 bg-[#1C5E27] hover:bg-[#174a20] text-white font-semibold rounded-md shadow-md transition">
                            Vincular
                        </button>
                    </div>
                </div>
            </section>

        </div>
    </BaseLayout>
</template>
