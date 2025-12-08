<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import CourseDAO from "../service/CourseDAO";
import BaseLayout from "../components/BaseLayout.vue";

const router = useRouter();

const course = ref({
  name: "",
  acronym: "",
  duration: null,
});

async function submitForm() {
  try {
    await CourseDAO.insert(course.value);
    alert("Curso cadastrado com sucesso!");

    router.back();

  } catch (err) {
    console.error("Erro ao cadastrar curso:", err);
    alert("Erro ao cadastrar curso: " + (err.response?.data?.message || err.message));
  }
}
</script>


<template>
  <BaseLayout>
  <div class="flex justify-center py-6 relative">
    <form
      @submit.prevent="submitForm"
      class="space-y-6 bg-white shadow-md p-6 rounded-xl w-full max-w-md"
    >
      <h2 class="text-xl font-bold text-gray-700">Cadastrar Curso</h2>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Nome</label>
        <input
          v-model="course.name"
          type="text"
          maxlength="100"
          class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-600 p-2"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1">Sigla</label>
        <input
          v-model="course.acronym"
          type="text"
          maxlength="10"
          class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-600 p-2"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1"
          >Duração (máx. 10)</label
        >
        <input
          v-model.number="course.duration"
          type="number"
          min="1"
          max="10"
          class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-600 p-2"
          required
        />
      </div>

      <button
        type="submit"
        class="w-full bg-[#1C5E27] hover:bg-[#1C5E10] text-white font-semibold px-4 py-2 rounded-lg shadow"
      >
        Salvar
      </button>
    </form>

    <RouterLink to="/courseDashboard">
      <button
        class="bg-[#1C5E27] text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 hover:bg-[#154b1f] transition-colors text-sm absolute bottom-6 right-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-arrow-big-left"
        >
          <path
            d="M13 9a1 1 0 0 1-1-1V5.061a1 1 0 0 0-1.811-.75l-6.835 6.836a1.207 1.207 0 0 0 0 1.707l6.835 6.835a1 1 0 0 0 1.811-.75V16a1 1 0 0 1 1-1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z"
          />
        </svg>
        Voltar
      </button>
    </RouterLink>
  </div>
  </BaseLayout>
</template>
