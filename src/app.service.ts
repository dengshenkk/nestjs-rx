import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { from, map, of, switchMap, toArray } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  async getHello() {
    return this.httpService.get('/users').pipe(
      map((res) => res.data),
      switchMap((data) => {
        return from(data).pipe(
          map((item: any) => {
            console.log('item :', item);
            item.posts = [];

            return item;
          }),
        );
        // return from(data).pipe((user) => {
        //   if (user.id % 2 === 0) {
        //   }
        // });
      }),
      toArray(),
      map((res) => {
        return res;
      }),
    );
  }

  getTest() {
    return this.httpService.get('/users').pipe(
      map((res) => res.data),
      switchMap((users) => {
        if (!Array.isArray(users)) {
          return of([]);
        }

        return from(users).pipe(
          map((user) => {
            return user;
          }),
          switchMap((user: any) => {
            user.posts = [];
            if (user.id % 2 === 0) {
              return this.httpService.get('/posts/' + user.id).pipe(
                map((posts) => {
                  user.posts.push(posts.data);
                  return user;
                }),
              );
            } else {
              return of(user);
            }
          }),
          toArray(),
        );
      }),
    );
  }
}
