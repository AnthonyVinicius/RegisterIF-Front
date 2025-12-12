<script setup>
import { ref, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { TextAlignJustify, Trash2 } from "lucide-vue-next";
import BaseLayout from "../../components/BaseLayout.vue";

import CourseDAO from "../../service/CourseDAO";
import SubjectDAO from "../../service/SubjectDAO";
import SubjectOfferingDAO from "../../service/SubjectOfferingDAO";
import TeacherDAO from "../../service/TeacherDAO";
import ClassroomDAO from "../../service/ClassroomDAO";

const route = useRoute();
const courseId = route.params.id;

const course = ref(null);

const linkedSubjects = ref([]);
const allSubjects = ref([]);
const showAttach = ref(false);

const offerings = ref([]);

async function loadCourse() {
  course.value = await CourseDAO.getById(courseId);
}

async function loadLinkedSubjects() {
  linkedSubjects.value = await SubjectDAO.getByCourse(courseId);
}

async function loadAllSubjects() {
  const subjects = await SubjectDAO.getAll();
  const linkedIds = linkedSubjects.value.map(s => s.id);
  allSubjects.value = subjects.filter(s => !linkedIds.includes(s.id));
}

async function toggleAttach() {
  showAttach.value = !showAttach.value;
  if (showAttach.value) await loadAllSubjects();
}

async function attachSubject(subject) {
  await SubjectDAO.addCourseToSubject(courseId, subject.id);
  await loadLinkedSubjects();
  await loadAllSubjects();
}

async function detachSubject(subject) {
  await SubjectDAO.removeCourseFromSubject(courseId, subject.id);
  await loadLinkedSubjects();
  if (showAttach.value) await loadAllSubjects();
}

async function normalizeSchedule(schedule) {
  if (!schedule) return "";
  if (schedule.time) return schedule.time;
  if (schedule.timeStart && schedule.timeEnd) {
    return `${schedule.timeStart} - ${schedule.timeEnd}`;
  }
  return "";
}

async function enrichOffering(offer) {
  const [subject, teacher, classroom] = await Promise.all([
    SubjectDAO.getById(offer.subjectId),
    TeacherDAO.getById(offer.teacherId),
    ClassroomDAO.getById(offer.classroomId),
  ]);

  return {
    ...offer,
    subject,
    teacher,
    classroom,
    scheduleText: `${offer.schedule?.day || ""} ${await normalizeSchedule(
      offer.schedule
    )}`,
  };
}

async function loadOfferings() {
  const all = await SubjectOfferingDAO.getAll();
  const filtered = all.filter(o => o.courseId == courseId);
  offerings.value = await Promise.all(filtered.map(enrichOffering));
}

onMounted(async () => {
  await loadCourse();
  await loadLinkedSubjects();
  await loadOfferings();
});
</script>

<template>
  <BaseLayout>
    <div class="space-y-14 px-6">
      <h1 class="text-2xl font-bold text-[#1C5E27]">
        Gerenciar Curso<span v-if="course">: {{ course.name }}</span>
      </h1>

      <section class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-[#1C5E27]">
            Disciplinas do Curso
          </h2>

          <button @click="toggleAttach"
            class="bg-[#1C5E27] hover:bg-[#174a20] text-white font-semibold py-2 px-5 rounded-md">
            {{ showAttach ? "Fechar" : "Vincular Disciplina" }}
          </button>
        </div>

        <section v-if="showAttach" class="space-y-4">
          <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-700">
              <thead class="bg-[#1C5E27]">
                <tr>
                  <th class="px-6 py-3 text-white font-semibold">Nome</th>
                  <th class="px-6 py-3 text-white font-semibold">Código</th>
                  <th class="px-6 py-3 text-white font-semibold text-center">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-200">
                <tr v-for="subject in allSubjects" :key="subject.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 font-medium text-gray-900">
                    <div class="flex items-center gap-2">
                      <div
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-800 font-semibold">
                        {{ subject.name.charAt(0).toUpperCase() }}
                      </div>
                      {{ subject.name }}
                    </div>
                  </td>

                  <td class="px-6 py-4">
                    {{ subject.code }}
                  </td>

                  <td class="px-6 py-4 flex justify-center">
                    <button @click="attachSubject(subject)"
                      class="bg-[#1C5E27] hover:bg-[#174a20] text-white font-semibold px-4 py-1.5 rounded-md">
                      Vincular
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div v-if="linkedSubjects.length === 0" class="text-gray-500 py-6">
          Nenhuma disciplina vinculada ainda.
        </div>

        <div v-else class="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-700">
            <thead class="bg-[#1C5E27]">
              <tr>
                <th class="px-6 py-3 text-white font-semibold">Nome</th>
                <th class="px-6 py-3 text-white font-semibold">Código</th>
                <th class="px-6 py-3 text-white font-semibold text-center">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              <tr v-for="subject in linkedSubjects" :key="subject.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">
                  <div class="flex items-center gap-2">
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-800 font-semibold">
                      {{ subject.name.charAt(0).toUpperCase() }}
                    </div>
                    {{ subject.name }}
                  </div>
                </td>

                <td class="px-6 py-4">
                  {{ subject.code }}
                </td>

                <td class="px-6 py-4 flex justify-center">
                  <button @click="detachSubject(subject)" class="text-red-600 hover:text-red-800">
                    <Trash2 class="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-[#1C5E27]">
            Ofertas do Curso
          </h2>

          <RouterLink :to="`/subject/${courseId}/Offering`">
            <button
              class="flex items-center gap-2 bg-[#1C5E27] hover:bg-[#174a20] text-white font-semibold py-2 px-5 rounded-md">
              <TextAlignJustify class="w-5 h-5" />
              Gerenciar Ofertas
            </button>
          </RouterLink>
        </div>

        <div v-if="offerings.length === 0" class="text-gray-500 py-6">
          Nenhuma oferta cadastrada para este curso.
        </div>

        <div v-else class="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-700">
            <thead class="bg-[#1C5E27]">
              <tr>
                <th class="px-6 py-3 text-white font-semibold">Disciplina</th>
                <th class="px-6 py-3 text-white font-semibold">Professor</th>
                <th class="px-6 py-3 text-white font-semibold">Sala</th>
                <th class="px-6 py-3 text-white font-semibold">Período</th>
                <th class="px-6 py-3 text-white font-semibold">Horário</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              <tr v-for="offer in offerings" :key="offer.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">
                  <div class="flex items-center gap-2">
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-800 font-semibold">
                      {{ offer.subject?.name.charAt(0).toUpperCase() }}
                    </div>
                    {{ offer.subject?.name }}
                  </div>
                </td>

                <td class="px-6 py-4">
                  {{ offer.teacher?.name }}
                </td>

                <td class="px-6 py-4">
                  {{ offer.classroom?.name }} - {{ offer.classroom?.location }}
                </td>

                <td class="px-6 py-4">
                  {{ offer.term }}
                </td>

                <td class="px-6 py-4">
                  {{ offer.scheduleText }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </BaseLayout>
</template>
