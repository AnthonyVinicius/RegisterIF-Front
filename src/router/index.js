import { createRouter, createWebHistory } from "vue-router";
import CourseRegisterView from "../views/course/CourseRegisterView.vue";
import UserRegisterView from "../views/user/UserRegisterView.vue";
import UserDashboardView from "../views/user/UserDashboardView.vue";
import CourseDashboardView from "../views/course/CourseDashboardView.vue";
import AllUsersView from "../views/user/AllUsersView.vue";
import AllCoursesView from "../views/course/AllCoursesView.vue";
import LoginView from "../views/LoginView.vue";
import NoAccess from "../views/NoAccess.vue";
import ClassroomDashboardView from "../views/classroom/ClassroomDashboardView.vue";
import ClassroomRegisterView from "../views/classroom/ClassroomRegisterView.vue";
import AllClassroomView from "../views/classroom/AllClassroomView.vue";
import EnrollmentView from "../views/enrollment/AllEnrollmentView.vue";
import StudentDashboardView from "../views/user/StudentDashboardView.vue";
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
      path: "/studentDashboard",
      name: "studentDashboard",
      component: StudentDashboardView,
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
    {
      path: "/enrollment",
      name: "enrollment",
      component: EnrollmentView,
    },
    { path: "/allUsers", name: "allUsers", component: AllUsersView },
    { path: "/allCourses", name: "allCourses", component: AllCoursesView },
    {
      path: "/courseManager",
      name: "courseManager",
      component: () => import("../views/course/CourseManagerView.vue"),
    },
    {
      path: "/subject",
      name: "SubjectsByCourse",
      component: () => import("../views/subject/SubjectsView.vue"),
    },
    {
      path: "/course/:id/manage",
      name: "courseManager",
      component: () => import("../views/course/CourseManagerView.vue"),
    },
    {
      path: "/subject/:id/Offering",
      name: "SubjectOffering",
      component: () =>
        import("../views/subject/SubjectOfferingRegisterView.vue"),
    },
    {
      path: "/allOfferings",
      name: "allOfferings",
      component: () => import("../views/subject/AllSubjectsOfferingsView.vue"),
    },
    {
      path: "/course/:id/subjects",
      name: "CourseSubjects",
      component: () => import("../views/course/CourseSubjects.vue"),
    },
    {
      path: "/enrollment/:studentId",
      name: "EnrollmentDetails",
      component: () => import("../views/enrollment/EnrollmentDetailsView.vue"),
    },
  ],
});

export default router;
