import { createRouter, createWebHistory } from "vue-router";
import CourseRegisterView from "../views/CourseRegisterView.vue";
import UserRegisterView from "../views/UserRegisterView.vue";
import UserDashboardView from "../views/UserDashboardView.vue";
import CourseDashboardView from "../views/CourseDashboardView.vue";
import AllUsersView from "../views/AllUsersView.vue";
import AllCoursesView from "../views/AllCoursesView.vue";
import LoginView from "../views/LoginView.vue";
import NoAccess from "../views/NoAccess.vue";
import ClassroomDashboardView from "../views/ClassroomDashboardView.vue";
import ClassroomRegisterView from "../views/ClassroomRegisterView.vue";
import AllClassroomView from "../views/AllClassroomView.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },

    { path: "/login", name: "login", component: LoginView },
    { path: "/noAccess", name: "noAccess", component: NoAccess },

    {
      path: "/registerUser",
      name: "registerUser",
      component: UserRegisterView,
    },
    {
      path: "/registerCourse",
      name: "registerCourse",
      component: CourseRegisterView,
    },

    {
      path: "/courseDashboard",
      name: "courseDashboard",
      component: CourseDashboardView,
    },
    {
      path: "/userDashboard",
      name: "userDashboard",
      component: UserDashboardView,
    },
    {
      path: "/classroomDashboard",
      name: "ClassroomDashboard",
      component: ClassroomDashboardView,
    },
    {
      path: "/allClassroom",
      name: "allClassroom",
      component: AllClassroomView,
    },
    {
      path: "/registerClassroom",
      name: "registerClassroom",
      component: ClassroomRegisterView,
    },

    { path: "/allUsers", name: "allUsers", component: AllUsersView },
    { path: "/allCourses", name: "allCourses", component: AllCoursesView },
    {
      path: "/courseManager",
      name: "courseManager",
      component: () => import("../views/CourseManagerView.vue"),
    },
    {
      path: "/subject",
      name: "SubjectsByCourse",
      component: () => import("../views/SubjectsView.vue"),
    },
    {
      path: "/course/:id/manage",
      name: "courseManager",
      component: () => import("../views/CourseManagerView.vue"),
    },
    {
      path: "/subject/:id/Offering",
      name: "SubjectOffering",
      component: () => import("../views/SubjectOfferingRegisterView.vue"),
    },
    {
      path: "/allOfferings",
      name: "allOfferings",
      component: () => import("../views/AllSubjectsOfferingsView.vue"),
    },
    {
      path: "/course/:id/subjects",
      name: "CourseSubjects",
      component: () => import("../views/CourseSubjects.vue"),
    },
  ],
});

export default router;
