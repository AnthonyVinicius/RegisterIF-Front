<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseLayout from "../../components/BaseLayout.vue";
import SubjectDAO from "../../service/SubjectDAO";
import TeacherDAO from "../../service/TeacherDAO";
import SubjectOfferingDAO from "../../service/SubjectOfferingDAO";
import CourseDAO from "../../service/CourseDAO";
import ClassroomDAO from "../../service/ClassroomDAO";

const route = useRoute();
const router = useRouter();
const courseId = route.params.id;

const course = ref(null);
const subjects = ref([]);
const teachers = ref([]);
const classrooms = ref([]);

const form = ref({
  subjectId: "",
  classroomId: "",
  teacherId: "",
  term: "",
  schedule: {
    day: "",
    timeStart: "",
    timeEnd: "",
  },
});

const selectedClassroom = computed(() =>
  classrooms.value.find((c) => c.id === form.value.classroomId)
);

async function loadData() {
  course.value = await CourseDAO.getById(courseId);
  subjects.value = await SubjectDAO.getByCourse(courseId);
  teachers.value = await TeacherDAO.getAll();
  classrooms.value = await ClassroomDAO.getAll();
}

async function saveOffer() {
  try {
    await SubjectOfferingDAO.insert({
      courseId: courseId,
      subjectId: form.value.subjectId,
      classroomId: form.value.classroomId,
      teacherId: form.value.teacherId,
      term: form.value.term,
      schedule: {
        day: form.value.schedule.day,
        time: `${form.value.schedule.timeStart} - ${form.value.schedule.timeEnd}`,
      },
    });

    alert("Oferta cadastrada com sucesso!");
    router.push(`/course/${courseId}/manage`);
  } catch (error) {
    console.log(form.value);
    console.error("Erro ao cadastrar oferta:", error);
    alert(
      "Erro ao cadastrar oferta: " +
        (error.response?.data?.message || error.message)
    );
  }
}

onMounted(loadData);
</script>

<template>
  <BaseLayout>
    <div class="flex justify-center py-6 relative px-6">
      <form
        @submit.prevent="saveOffer"
        class="space-y-6 bg-white shadow-md p-6 rounded-xl w-full max-w-lg"
      >
        <h2 class="text-xl font-bold text-gray-700">
          Ofertar Disciplina: {{ course?.name }}
        </h2>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1"
            >Disciplina</label
          >
          <select
            v-model="form.subjectId"
            required
            class="w-full border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-600"
          >
            <option disabled value="">Selecione</option>
            <option v-for="s in subjects" :key="s.id" :value="s.id">
              {{ s.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1"
            >Professor</label
          >
          <select
            v-model="form.teacherId"
            required
            class="w-full border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-600"
          >
            <option disabled value="">Selecione</option>
            <option v-for="t in teachers" :key="t.id" :value="t.id">
              {{ t.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1"
            >Sala de Aula</label
          >
          <select
            v-model="form.classroomId"
            required
            class="w-full border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-600"
          >
            <option disabled value="">Selecione</option>
            <option v-for="c in classrooms" :key="c.id" :value="c.id">
              {{ c.name }} - {{ c.location }}
            </option>
          </select>

          <p v-if="selectedClassroom" class="text-xs text-gray-500 mt-1">
            Local: <strong>{{ selectedClassroom.location }}</strong>
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1"
            >Período</label
          >
          <input
            type="text"
            v-model="form.term"
            required
            placeholder="Ex: 2025.1"
            class="w-full border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-600"
          />
        </div>

        <div class="border-t pt-4 space-y-4">
          <h3 class="text-md font-semibold text-[#1C5E27]">Horário</h3>

          <label class="block text-sm font-medium text-gray-600 mb-1"
            >Dia da Semana</label
          >
          <select
            v-model="form.schedule.day"
            required
            class="w-full border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-600"
          >
            <option disabled value="">Selecione</option>
            <option>Segunda</option>
            <option>Terça</option>
            <option>Quarta</option>
            <option>Quinta</option>
            <option>Sexta</option>
          </select>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs text-gray-600">Início</label>
              <input
                type="time"
                v-model="form.schedule.timeStart"
                required
                class="w-full border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div>
              <label class="text-xs text-gray-600">Término</label>
              <input
                type="time"
                v-model="form.schedule.timeEnd"
                required
                class="w-full border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-[#1C5E27] hover:bg-[#1C5E10] text-white font-semibold px-4 py-2 rounded-lg shadow"
        >
          Salvar
        </button>
      </form>

      <RouterLink :to="`/course/${courseId}/manage`">
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
