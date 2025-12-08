<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseLayout from "../components/BaseLayout.vue";
import ClassroomDAO from "../service/ClassroomDAO";

const router = useRouter();

const classroom = ref({
  name: "",
  location: ""
});

async function submitForm() {
  try {
    await ClassroomDAO.insert(classroom.value);

    alert("Sala cadastrada com sucesso!");
    router.back();

  } catch (err) {
    console.error("Erro ao cadastrar sala:", err);
    alert("Erro ao cadastrar sala: " + (err.response?.data?.message || err.message));
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
        <h2 class="text-xl font-bold text-gray-700 text-center">Cadastrar Sala de Aula</h2>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Nome</label>
          <input
            v-model="classroom.name"
            type="text"
            maxlength="100"
            placeholder="Ex: ADS2023-1"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-600 p-2"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Localização</label>
          <input
            v-model="classroom.location"
            type="text"
            maxlength="100"
            placeholder="Ex: Sala 1"
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

      <RouterLink to="/classroomDashboard">
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
