import { Routes } from "@angular/router";
import { Home } from "./home";

export const homeRoutes: Routes = [
    {
    path:'',
        component: Home,
        title:'Home',
    },

            {path: 'overview', loadComponent: () => import('../overview/overview').then(m => m.Overview),title:'Overview' },
  { path: 'education', loadComponent: () => import('../education/education').then(m => m.Education) ,title:'Education'},
  { path: 'experience', loadComponent: () => import('../experience/experience').then(m => m.Experience) ,title:'Experience'},
  { path: 'skills', loadComponent: () => import('../skills/skills').then(m => m.Skills),title:'Skills' },
  { path: 'projects', loadComponent: () => import('../projects/projects').then(m => m.Projects),title:'Projects' },
  { path: 'profile', loadComponent: () => import('../profile/profile').then(m => m.Profile),title:'Profile' }
        ]
    


        
        
    