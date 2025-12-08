<script setup>
import { useRoute } from "vue-router";
import Actions from "../components/Actions.vue";
import { NotepadText, TextAlignJustify } from "lucide-vue-next";
import BaseLayout from "../components/BaseLayout.vue";
import { ref, onMounted } from "vue";
import CourseDAO from "../service/CourseDAO";

const route = useRoute();
const courseId = route.params.id;

const course = ref(null);

async function loadCourse() {
  try {
    course.value = await CourseDAO.getById(courseId);
  } catch (error) {
    console.error("Erro ao carregar curso:", error);
  }
}

const actions = [
  {
    icon: NotepadText,
    title: "Vincular Disciplina",
    description: "Gerenciar disciplinas do curso",
    color: "text-green-800",
    to: `/course/${courseId}/subjects`,
  },
  {
    icon: TextAlignJustify,
    title: "Ofertas de Disciplina",
    description: "Gerenciar ofertas",
    color: "text-green-800",
    to: `/subject/${courseId}/Offering`,
  },
];

onMounted(loadCourse);
</script>

<template>
  <BaseLayout>
    <div class="space-y-8">
      <h1 class="text-2xl font-bold text-ponto-if-green">
        Gerenciar Curso<span v-if="course">: {{ course.name }}</span>
      </h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <RouterLink
          v-for="action in actions"
          :key="action.title"
          :to="action.to"
        >
          <Actions>
            <template #logo>
              <component
                :is="action.icon"
                :class="`${action.color} w-12 h-12`"
              />
            </template>
            <template #title>{{ action.title }}</template>
            <template #description>{{ action.description }}</template>
          </Actions>
        </RouterLink>
      </div>
    </div>
  </BaseLayout>
</template>
