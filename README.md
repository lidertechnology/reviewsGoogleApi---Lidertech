# reviewsGoogleApi---Lidertech


Excelente. Con gusto, he preparado una guía completa y detallada, basada en todo lo que aprendimos, para que puedas configurar las reseñas de Google en cualquier proyecto de Angular de manera infalible.

# 1. Configuración de la Clave de API de Google
La clave de API es el primer punto de falla. Debe estar configurada para permitir peticiones del servidor de desarrollo de Angular sin restricciones de "referer".

  Paso 1.1: Ir a la consola de Google Cloud. Navega a la sección de Credenciales en tu proyecto.

  Paso 1.2: Crear o editar la clave. Si no tienes una clave, crea una. Si ya la tienes, edítala.

  Paso 1.3: Establecer las restricciones de la aplicación. En Restricciones de aplicaciones, selecciona Ninguno. Esto es crucial porque el proxy de Angular actúa como un servidor, y las peticiones de servidor a servidor no incluyen la cabecera Referer. Esta es la principal razón por la que obtuvimos el error REQUEST_DENIED.

  Paso 1.4: Restringir las APIs. En Restricciones de API, selecciona Restringir clave. Luego, haz clic en + Añadir otra API y agrega las siguientes APIs a la lista:

Places API: Es la API que necesitas para obtener las reseñas.

Maps JavaScript API: Es un buen complemento si planeas mostrar el mapa del lugar en tu aplicación.

Paso 1.5: Guardar. Haz clic en Guardar y espera unos 5-10 minutos para que los cambios se propaguen por los servidores de Google.

# 2. Configuración del Proxy en Angular
El proxy es la solución para el problema de CORS (Cross-Origin Resource Sharing) del navegador. Le dice a Angular que las peticiones a ciertas rutas deben ser redirigidas a un servidor externo.

Paso 2.1: Crear el archivo de configuración del proxy. En la raíz de tu proyecto de Angular (al mismo nivel que angular.json), crea un archivo llamado proxy.conf.json.

Paso 2.2: Agregar la configuración del proxy. Agrega el siguiente código, asegurándote de usar la URL base de la API de Google Maps:

JSON

    {
      "/api/*": {
        "target": "https://maps.googleapis.com",
        "secure": true,
        "changeOrigin": true,
        "logLevel": "debug",
        "pathRewrite": {
          "^/api": ""
        }
      }
    }


"target": "https://maps.googleapis.com": Es el destino final de la petición.

"pathRewrite": { "^/api": "" }: Esto elimina el /api de la URL antes de enviarla a Google.

Paso 2.3: Configurar angular.json. Abre angular.json y agrega la propiedad proxyConfig dentro de la sección architect.serve.options de tu proyecto principal.

JSON

    "serve": {
      "builder": "@angular/build:dev-server",
      "options": {
        "proxyConfig": "proxy.conf.json"
      },
      ...
    }

    
# 3. Código en Angular
Aquí es donde tu aplicación llama al servicio y muestra los datos. 
La clave es asegurarse de que las URLs y la estructura de la respuesta sean correctas.

Paso 3.1: Crear el servicio (reviews.service.ts). 
Usa inject() para inyectar el HttpClient y configura la URL de la API para que apunte al proxy.

TypeScript

    import { inject, Injectable } from '@angular/core';
    import { environment } from '../../environments/environment';
    import { HttpClient } from '@angular/common/http';
    
    @Injectable({
      providedIn: 'root'
    })
    export class ReviewsService {
    
      private readonly http = inject(HttpClient);
      private readonly apiKey = environment.googleMapsApiKey;
      private readonly apiUrl = '/api/maps/api/place/details/json'; // URL del proxy
    
      getReviews(placeId: string) {
        const url = `${this.apiUrl}?place_id=${placeId}&key=${this.apiKey}`;
        return this.http.get(url);
      }
    }
Paso 3.2: Llamar al servicio en el componente (reviews.component.ts). 
La llamada al servicio debe hacerse en el ngOnInit para que se ejecute en el momento adecuado del ciclo de vida del componente.

TypeScript

    import { Component, OnInit, inject } from '@angular/core';
    import { ReviewsService } from 'ruta/a/reviews.service';
    
    @Component({
      // ...
    })
    export class ReviewsComponent implements OnInit {
    
      private readonly reviewsService = inject(ReviewsService);
      public reviews: any[] = [];
      placeId = 'TU_PLACE_ID'; // Reemplaza con tu ID de lugar
    
      constructor() { }
    
      ngOnInit(): void {
        this.reviewsService.getReviews(this.placeId).subscribe((data: any) => {
          if (data.result && data.result.reviews) {
            this.reviews = data.result.reviews;
          }
        });
      }
    }
    
Paso 3.3: Mostrar las reseñas en la plantilla (reviews.component.html). Usa @for para iterar sobre la variable reviews que llenaste en el componente. Es importante usar un track para que Angular identifique cada elemento de forma única. La API no tiene un id por reseña, por lo que puedes usar una combinación de propiedades, como el nombre del autor y la fecha, para crear una clave única.

HTML

    @if (reviews.length > 0) {
      @for (review of reviews; track review.author_name + review.time) {
        <div class="review-card">
          <p>{{ review.author_name }}</p>
          <p>{{ review.text }}</p>
        </div>
      }
    } @else {
      <p>Aún no hay reseñas para este negocio.</p>
    }

# 4. Último Paso: Reiniciar el Servidor
Después de todos los cambios, siempre debes detener tu servidor de Angular y reiniciarlo para que la configuración del proxy surta efecto.

    ng serve

Con estos pasos, tu aplicación estará configurada correctamente para obtener y mostrar las reseñas de Google.




## Solo ves cinco reseñas porque esa es la limitación de diseño de la API de Place Details de Google. 
La API está optimizada para mostrar la información más relevante y de mayor calidad de un lugar. 
Por defecto, solo devuelve las cinco reseñas más útiles, sin importar si son las más recientes o no. 
Esta funcionalidad no se puede cambiar con parámetros en la llamada a la API.

Para obtener más reseñas, no puedes usar la API de Place Details. 
Google ofrece otra solución para este propósito, a través de la API de Google My Business.

# API de Google My Business
Esta API te permite acceder a una gran cantidad de datos de negocios, incluyendo todas las reseñas de un lugar. Sin embargo, tiene un proceso de configuración y uso más complejo:

  1. Verificación de la cuenta: Debes ser el propietario o tener acceso a la cuenta de Google My Business del negocio cuyas reseñas quieres obtener.

  2. Activación de la API: Debes activar la API de Google My Business en tu Consola de Google Cloud.

  3. Autenticación: Necesitas configurar OAuth 2.0 para autenticarte como el propietario del negocio.

Una vez que tengas acceso a esta API, puedes hacer una petición para obtener todas las reseñas, ya que no tiene la limitación de cinco reseñas de la API de Place Details.

# Resumen de la situación
API de Place Details: Ideal para obtener detalles básicos y un resumen rápido (las 5 reseñas más útiles). Rápida de configurar.

API de Google My Business: Ideal para obtener todas las reseñas. Requiere ser el propietario del negocio y un proceso de autenticación más complejo.

Si necesitas mostrar más reseñas que las cinco que obtienes actualmente, la única forma de hacerlo es utilizando la API de Google My Business.
