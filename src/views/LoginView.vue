<template>
  <div class="flex items-center justify-center min-h-screen p-4">
    <div
      class="w-full max-w-md p-8 space-y-8 bg-[#1c5e27] rounded-2xl shadow-lg"
    >
      <div class="text-center">
        <div class="inline-block p-3 mb-4 bg-white rounded-full">
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
            class="lucide lucide-shield-check-icon lucide-shield-check"
          >
            <path
              d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
            />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>

        <h1 class="text-2xl font-bold text-white">Administração de presença</h1>

        <p class="text-gray-300">Acesso restrito ao administrador</p>
      </div>

      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="email" class="block mb-2 text-sm font-medium text-white">
            Usuário
          </label>
          <input
            v-model="email"
            type="email"
            name="email"
            id="email"
            class="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="seuemail@exemplo.com"
          />
        </div>

        <div>
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-white"
          >
            Senha
          </label>
          <input
            v-model="password"
            type="password"
            name="password"
            id="password"
            class="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          class="w-full px-4 py-3 font-semibold text-green-700 bg-white rounded-lg hover:bg-gray-200 transition-colors"
        >
          Entrar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { AuthService } from "../service/AuthService";
import { useUserStore } from "../stores/user";

const router = useRouter();
const userStore = useUserStore();

const email = ref("");
const password = ref("");
const loading = ref(false);

async function handleLogin() {
  if (!email.value || !password.value) {
    alert("Preencha email e senha!");
    return;
  }

  loading.value = true;

  try {
    const session = await AuthService.login(email.value, password.value);

    userStore.setSession(session.token, session.userId);
    userStore.setUserData({
      name: session.name,
      role: session.role,
    });

    if (session.role === "ADMIN") {
      router.push("/courseDashboard");
    } else {
      router.push("/noAccess");
    }
  } catch (err) {
    console.error(err);
    alert("Email ou senha incorretos!");
  } finally {
    loading.value = false;
  }
}
</script>
