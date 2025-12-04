import { createRouter, createWebHistory } from "vue-router";
import CourseRegisterView from "../views/CourseRegisterView.vue";
import UserRegisterView from "../views/UserRegisterView.vue";
import UserDashboardView from "../views/UserDashboardView.vue";
import CourseDashboardView from "../views/CourseDashboardManagerView.vue";
import AllUsersView from "../views/AllUsersView.vue";
import AllCoursesView from "../views/AllCoursesView.vue";
import LoginView from "../views/LoginView.vue";
import NoAccess from "../views/NoAccess.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    
    { path: "/login", name: "login", component: LoginView },
    { path: "/noAccess", name: "noAccess", component: NoAccess },

    { path: "/registerUser", name: "registerUser", component: UserRegisterView },
    { path: "/registerCourse", name: "registerCourse", component: CourseRegisterView },

    { path: "/courseDashboard", name: "courseDashboard", component: CourseDashboardView },
    { path: "/userDashboard", name: "userDashboard", component: UserDashboardView },

    { path: "/allUsers", name: "allUsers", component: AllUsersView },
    { path: "/allCourses", name: "allCourses", component: AllCoursesView },

    {
      path: "/subject",
      name: "SubjectsByCourse",
      component: () => import("../views/SubjectsView.vue"),
    }
  ]
});

export default router;
