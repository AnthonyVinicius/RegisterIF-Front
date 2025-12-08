<script setup>
import { ref, onMounted } from "vue";
import BaseLayout from "../components/BaseLayout.vue";
import SubjectOfferingDAO from "../service/SubjectOfferingDAO";
import CourseDAO from "../service/CourseDAO";
import SubjectDAO from "../service/SubjectDAO";
import TeacherDAO from "../service/TeacherDAO";
import ClassroomDAO from "../service/ClassroomDAO";

const offerings = ref([]);

async function normalizeSchedule(schedule) {
  if (!schedule) return "";

  if (schedule.time) {
    return schedule.time;
  }

  if (schedule.timeStart && schedule.timeEnd) {
    return `${schedule.timeStart} - ${schedule.timeEnd}`;
  }

  return "";
}

async function enrichOffering(offer) {
  const [course, subject, teacher, classroom] = await Promise.all([
    CourseDAO.getById(offer.courseId),
    SubjectDAO.getById(offer.subjectId),
    TeacherDAO.getById(offer.teacherId),
    ClassroomDAO.getById(offer.classroomId),
  ]);

  return {
    ...offer,
    course,
    subject,
    teacher,
    classroom,
    scheduleText: `${offer.schedule?.day || ""} ${await normalizeSchedule(offer.schedule)}`,
  };
}

async function loadData() {
  try {
    const data = await SubjectOfferingDAO.getAll();
    offerings.value = await Promise.all(data.map((o) => enrichOffering(o)));
  } catch (error) {
    console.error("Erro ao carregar ofertas:", error);
  }
}

async function handleDelete(id) {
  if (!confirm("Tem certeza que deseja excluir esta oferta?")) return;
  try {
    await SubjectOfferingDAO.delete(id);
    await loadData();
  } catch (error) {
    console.error("Erro ao excluir oferta:", error);
  }
}

onMounted(loadData);
</script>

<template>
  <BaseLayout>
    <div class="space-y-8 pb-20 relative">
      <h1 class="text-2xl font-bold text-ponto-if-green">
        Todas as Ofertas de Disciplinas
      </h1>

      <section class="bg-white p-5 rounded-md shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-700">
            <thead class="bg-[#1C5E27] text-white">
              <tr>
                <th class="px-6 py-3">Curso</th>
                <th class="px-6 py-3">Disciplina</th>
                <th class="px-6 py-3">Professor</th>
                <th class="px-6 py-3">Sala</th>
                <th class="px-6 py-3">Período</th>
                <th class="px-6 py-3">Horário</th>
                <th class="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 bg-white">

              <tr
                v-for="offer in offerings"
                :key="offer.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4">
                  {{ offer.course?.name }}
                </td>

                <td class="px-6 py-4">
                  {{ offer.subject?.name }}
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

                <td class="px-6 py-4 text-right">
                  <button
                    @click="handleDelete(offer.id)"
                    class="text-red-600 hover:text-red-800 p-2"
                    title="Excluir"
                  >
                    🗑
                  </button>
                </td>
              </tr>

              <tr v-if="offerings.length === 0">
                <td colspan="7" class="text-center py-4 text-gray-500">
                  Nenhuma oferta cadastrada ainda.
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </section>
    </div>
  </BaseLayout>
</template>
