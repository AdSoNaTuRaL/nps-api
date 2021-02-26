import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

class NPSController {
    async execute(request: Request, response: Response) {
        const { survey_id } = request.params;

        const surveysUsersRepository = getCustomRepository(SurveyUserRepository);

        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull())
        });

        const detractor = surveysUsers.filter(
            (survey) => survey.value >= 0 && survey.value <= 6
        ).length;

        const promotors = surveysUsers.filter(
            survey => survey.value >= 9 && survey.value <= 10
        ).length;

        const passive = surveysUsers.filter(
            survey => survey.value >= 7 && survey.value <= 8
        ).length;

        const totalAnswers = surveysUsers.length;

        const calculate = Number((((promotors - detractor) / totalAnswers) * 100).toFixed(2));

        return response.json({
            detractor,
            promotors,
            passive,
            totalAnswers,
            nps: calculate
        });

    }
}

export { NPSController };