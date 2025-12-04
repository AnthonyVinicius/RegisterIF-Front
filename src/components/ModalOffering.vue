<script setup>
import { ref, onMounted } from "vue";
import SubjectOfferingDAO from "../service/SubjectOfferingDAO";
import CourseSubjectDAO from "../service/CourseSubjectDAO";
import UserDAO from "../service/UserDAO";
import ClassroomDAO from "../service/ClassroomDAO";

const props = defineProps(["courseId", "subjectId"]);
const emit = defineEmits(["close"]);

const professors = ref([]);
const classrooms = ref([]);
const courseSubjects = ref([]);

const form = ref({
  teacherId: "",
  classroomId: "",
  term: "",
  schedule: {
    weekDays: [],
    startTime: "",
    endTime: "",
  },
});

const weekDaysList = [
  { key: "SEG", label: "Segunda" },
  { key: "TER", label: "Terça" },
  { key: "QUA", label: "Quarta" },
  { key: "QUI", label: "Quinta" },
  { key: "SEX", label: "Sexta" },
];

async function loadData() {
  professors.value = (await UserDAO.getAll()).filter(u => u.role === "PROFESSOR");
  classrooms.value = await ClassroomDAO.getAll();

  courseSubjects.value = await CourseSubjectDAO.getByCourse(props.courseId);
}

onMounted(loadData);

async function save() {
  const cs = courseSubjects.value.find(
    cs => cs.subject.id === props.subjectId
  );

  const payload = {
    courseSubjectId: cs.id,
    teacherId: form.value.teacherId,
    classroomId: form.value.classroomId,
    term: form.value.term,
    schedule: form.value.schedule,
  };

  await SubjectOfferingDAO.insert(payload);

  emit("close");
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-6">
    <div class="bg-white rounded-lg p-6 shadow-md w-full max-w-lg space-y-4">
      <h2 class="text-xl font-bold text-[#1C5E27]">Nova Turma</h2>

      <!-- Professor -->
      <label class="text-sm font-medium">Professor</label>
      <select v-model="form.teacherId" class="input-style">
        <option disabled value="">Selecione um professor</option>
        <option v-for="p in professors" :key="p.id" :value="p.id">
          {{ p.name }}
        </option>
      </select>

      <!-- Sala -->
      <label class="text-sm font-medium">Sala</label>
      <select v-model="form.classroomId" class="input-style">
        <option disabled value="">Selecione uma sala</option>
        <option v-for="c in classrooms" :key="c.id" :value="c.id">
          {{ c.code }}
        </option>
      </select>

      <!-- Term -->
      <label class="text-sm font-medium">Período (Term)</label>
      <input v-model="form.term" placeholder="2025.1" class="input-style" />

      <!-- Schedule -->
      <label class="text-sm font-medium">Horários</label>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="d in weekDaysList"
          :key="d.key"
          :class="[
            'px-3 py-1 rounded-full border text-xs',
            form.schedule.weekDays.includes(d.key)
              ? 'bg-[#1C5E27] text-white'
              : 'bg-white text-[#1C5E27]'
          ]"
          @click="() => {
            const idx = form.schedule.weekDays.indexOf(d.key)
            idx >= 0 ? form.schedule.weekDays.splice(idx, 1)
                     : form.schedule.weekDays.push(d.key)
          }"
        >
          {{ d.label }}
        </button>
      </div>

      <div class="flex gap-2">
        <input v-model="form.schedule.startTime" type="time" class="input-style w-full" />
        <input v-model="form.schedule.endTime" type="time" class="input-style w-full" />
      </div>

      <div class="flex justify-end gap-4 pt-4">
        <button @click="emit('close')" class="btn-cancel">Cancelar</button>
        <button @click="save" class="btn-primary">Salvar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-style {
  width: 100%;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 6px;
}
.btn-primary {
  background: #1C5E27;
  color: #fff;
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: 600;
}
.btn-cancel {
  background: #ccc;
  padding: 8px 14px;
  border-radius: 6px;
}
</style>
