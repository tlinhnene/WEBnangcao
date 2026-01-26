import { Component } from '@angular/core';

@Component({
  selector: 'app-listcustomer',
  standalone: false,
  templateUrl: './listcustomer.html',
  styleUrls: ['./listcustomer.css'],
})
export class Listcustomer {
  customerTypes = [
    {
      CustomerTypeId: 1,
      CustomterTypeName: 'VIP',
      Customers: [
        {
          Id: 'Cus123',
          Name: 'Obama',
          Email: 'obama@gmail.com',
          Age: 67,
          Image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjQWS7DVw7m4NsB0j_ysJL9QEihUdhxN1L-Q&s',
        },
        {
          Id: 'Cus456',
          Name: 'Kim Jong Un',
          Email: 'unun@gmail.com',
          Age: 38,
          Image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLR62jKu0Yc1V0Nj9YAsXUnq0mRIPjXAk-nw&s',
        },
        {
          Id: 'Cus789',
          Name: 'Putin',
          Email: 'putin@gmail.com',
          Age: 77,
          Image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFqUw0WGSx-SFT35zB03dc7Zbxp6XVyBM09Q&s',
        },
      ],
    },
    {
      CustomerTypeId: 2,
      CustomterTypeName: 'NORMAL',
      Customers: [
        {
          Id: 'Cus000',
          Name: 'Tlinhxinh',
          Email: 'tlinhsayhii.com',
          Age: 16,
          Image:
            'https://scontent.fsgn2-11.fna.fbcdn.net/v/t51.82787-15/519518440_18275921281279074_7291324491632506452_n.jpg',
        },
        {
          Id: 'Cus111',
          Name: 'Tap Can Binh',
          Email: 'binhbinh@gmail.com',
          Age: 67,
          Image:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Xi_Jinping_in_Beijing_on_May_13%2C_2025_%28cropped%29.jpg/250px-Xi_Jinping_in_Beijing_on_May_13%2C_2025_%28cropped%29.jpg',
        },
      ],
    },
  ];
}
