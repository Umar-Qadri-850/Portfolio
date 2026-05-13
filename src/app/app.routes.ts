import { Routes } from '@angular/router';

import { Home } from '../home/home';

export const routes: Routes = [
 {
 path:'',
 redirectTo:'Home',
 pathMatch:'full'
 },
     {
        path:'Home',
        loadChildren: ()=> import('../home/home.routes').then(x=>x.homeRoutes)
      
    }
];
