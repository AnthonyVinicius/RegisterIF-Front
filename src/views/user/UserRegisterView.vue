<script setup>
import { ref } from "vue";
import UserDAO from "../../service/UserDAO";
import BaseLayout from "../../components/BaseLayout.vue";

const user = ref({
  name: "",
  email: "",
  registration: "",
  password: "",
  role: "STUDENT",
});

const limparForms = () => {
  user.value = {
    name: "",
    email: "",
    registration: "",
    password: "",
    role: "STUDENT",
  };
};

const roles = ref(["ADMIN", "STUDENT", "PROFESSOR", "SECRETARY", "TECHNICIAN"]);

const submitForm = async () => {
  try {
     if (user.value.password.length < 8) {
      alert("A senha deve conter no mínimo 8 caracteres.");
      return;
    }

    await UserDAO.insert(user.value);
    alert("Usuário cadastrado com sucesso!");
    limparForms();
  } catch (err) {
    console.error(err);
    alert("Erro ao cadastrar usuário: " + err.message);
  }
};
</script>

<template>
  <BaseLayout>
    <div class="flex justify-center py-1">
      <form
        @submit.prevent="submitForm"
        class="space-y-6 bg-white shadow-md p-6 rounded-xl w-full max-w-md"
      >
        <h2 class="text-xl font-bold text-gray-700">Cadastrar Usuário</h2>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1"
            >Nome</label
          >
          <input
            v-model="user.name"
            type="text"
            maxlength="100"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 p-2"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1"
            >Email</label
          >
          <input
            v-model="user.email"
            type="email"
            maxlength="150"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 p-2"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1"
            >Matrícula</label
          >
          <input
            v-model="user.registration"
            type="text"
            maxlength="20"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 p-2"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1"
            >Senha</label
          >
          <input
            v-model="user.password"
            type="password"
            maxlength="20"
            class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 p-2"
            required
          />
        </div>

        <div class="relative">
          <label
            for="role"
            class="block text-sm font-medium text-gray-600 mb-1"
          >
            Função / Papel
          </label>

          <div class="relative">
            <svg
              class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>

            <select
              id="role"
              v-model="user.role"
              class="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 pr-8 text-sm font-medium text-gray-700 focus:border-[#1C5E27] focus:ring-2 focus:ring-[#1C5E27] focus:bg-white shadow-sm transition-all duration-200"
              required
            >
              <option disabled value="">Selecione uma função</option>
              <option
                v-for="role in roles"
                :key="role"
                :value="role"
                class="text-gray-700"
              >
                {{ role }}
              </option>
            </select>
          </div>

          <p class="text-xs text-gray-400 mt-1">
            Escolha o tipo de usuário do sistema
          </p>
        </div>

        <button
          type="submit"
          class="w-full bg-[#1C5E27] text-white hover:bg-[#1C5E10] font-semibold px-4 py-2 rounded-lg shadow"
        >
          Salvar
        </button>
      </form>

      <router-link to="/userDashboard">
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
      </router-link>
    </div>
  </BaseLayout>
</template>
