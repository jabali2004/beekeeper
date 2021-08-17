import { NbMenuItem } from '@nebular/theme';
import { Subject } from 'rxjs';

export const MENU_ITEMS_SUBJECT: Subject<NbMenuItem[]> = new Subject();

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Home',
    data: {
      translation: 'pages.home.title'
    },
    icon: 'home-outline',
    link: '/pages',
    home: true,
    hidden: false
  }
  // {
  //   title: 'Management',
  //   data: {
  //     translation: 'pages.project.management'
  //   },
  //   icon: 'layout-outline',
  //   link: '/pages/project/:id/management',
  //   home: false,
  //   hidden: false
  // }
  // {
  //   title: 'Administration',
  //   icon: 'options-2-outline',
  //   link: '/pages/administration',
  //   hidden: true,
  //   pathMatch: 'prefix',
  //   data: {
  //     restrictedAccess: true
  //   }
  // }
];
