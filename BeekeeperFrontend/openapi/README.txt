Die Templates im Ordner "templates" wurden aus dem Swagger-CodeGen extrahiert.
Es sind/waren die "typescript-angular"-Dateien in Swagger-CodeGen v2.4-SNAPSHOT.

Folgende Templates unterscheiden sich von den Originalen innerhalb des Swagger-Tools:

[Dateiname]                               [Änderungen zum Original]
------------------------------------------------------------------------------------------------------------------------
licenseInfo.mustache                       Informationen zur Herkunft der generierten Models hinzugefügt

model.mustache                             statische imports für/aus Angular hinzugefügt

modelBaseModel.mustache                    neu erstellt; Definition der Swagger-unabhängigen Basisklasse "BaseModel"

modelGeneric.mustache                      alles ...

variables.mustache                         Eingliederung/Deklaration der Swagger-unabhängigen Basisklasse "BaseModel"

