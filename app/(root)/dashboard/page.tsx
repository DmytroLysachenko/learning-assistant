"use client";

import CustomSelect from "@/components/CustomSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  cleanAllVocabularyData,
  removeDuplicatesFromTable,
} from "@/lib/actions/admin";
import { seedWordsInChunks } from "@/lib/actions/ai";
import { cn } from "@/lib/utils";
import { LanguageLevels } from "@/types";

import React from "react";

const options = [
  { value: "A0", label: "A0" },
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "B1", label: "B1" },
  { value: "B2", label: "B2" },
  { value: "C1", label: "C1" },
  { value: "C2", label: "C2" },
];

const Dashboard = () => {
  const [generating, setGenerating] = React.useState(false);
  const [level, setLevel] = React.useState("A0");
  const [quantity, setQuantity] = React.useState(10);

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="h-40">
        {generating && (
          <div className="w-full h-40 flex flex-col py-4 gap-5justify-center items-center text-5xl">
            <div className="relative h-20">
              <div
                className={cn(
                  "absolute w-20 flex ",
                  generating && "animate-roll"
                )}
              >
                <span className="mr-5 text-2xl">🍔</span>
                <span>👨‍🦽</span>
                <span>💨</span>
                <span>💨</span>
              </div>
            </div>
            <span>Generating...</span>
          </div>
        )}
      </div>

      <div className="flex gap-5 justify-center py-20">
        <div className=" flex gap-2">
          <CustomSelect
            options={options}
            currentValue={level}
            isDisabled={generating}
            handleValueChange={(value) => setLevel(value)}
            placeholder="Select level"
          />
          <Input
            placeholder="Enter number of words"
            type="number"
            disabled={generating}
            value={quantity}
            onChange={(e) => {
              setQuantity(Number(e.target.value));
            }}
          />
        </div>
        <Button
          onClick={async () => {
            await cleanAllVocabularyData();
          }}
          disabled={generating}
        >
          Delete all data from vocabularies
        </Button>
        <Button
          onClick={async () => {
            await removeDuplicatesFromTable("pl");
            await removeDuplicatesFromTable("ru");
          }}
          disabled={generating}
        >
          Remove all duplicates
        </Button>
        <Button
          onClick={async () => {
            setGenerating(true);
            await seedWordsInChunks(
              quantity,
              level as LanguageLevels,
              100,
              5000
            );

            await removeDuplicatesFromTable("pl");
            await removeDuplicatesFromTable("ru");
            setGenerating(false);
          }}
          disabled={generating}
        >
          Lets rock
        </Button>
      </div>
    </main>
  );
};

export default Dashboard;
